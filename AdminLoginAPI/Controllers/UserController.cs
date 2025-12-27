using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OracleAdminLoginAPI.Data;
using OracleAdminLoginAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OracleAdminLoginAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IConfiguration _configuration;

        public UserController(UserDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ✅ USER REGISTRATION
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody] User model)
        {
            if (string.IsNullOrWhiteSpace(model.FullName) ||
                string.IsNullOrWhiteSpace(model.PhoneNumber) ||
                string.IsNullOrWhiteSpace(model.UserEmail) ||
                string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { message = "All fields are required." });
            }

            try
            {
                if (_context.Users.Any(u => u.UserEmail == model.UserEmail))
                    return Conflict(new { message = "User already exists." });

                // Hash password
                model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);

                _context.Users.Add(model);
                _context.SaveChanges();

                return Ok(new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration failed.", error = ex.Message });
            }
        }

        // ✅ USER LOGIN
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (string.IsNullOrWhiteSpace(loginRequest.UserEmail) || string.IsNullOrWhiteSpace(loginRequest.Password))
                return BadRequest(new { message = "Email and Password are required" });

            try
            {
                var user = _context.Users.FirstOrDefault(u => u.UserEmail == loginRequest.UserEmail);

                if (user == null || !BCrypt.Net.BCrypt.Verify(loginRequest.Password, user.Password))
                    return Unauthorized(new { message = "Invalid credentials" });

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT key not configured"));

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[] {
                        new Claim(ClaimTypes.Name, user.UserEmail ?? "unknown@example.com")
                    }),
                    Expires = DateTime.UtcNow.AddHours(2),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new LoginResponse { Token = tokenString, Message = "Login successful" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Login failed.", error = ex.Message });
            }
        }

        // ✅ GET ALL USERS (requires token)
        [Authorize]
        [HttpGet]
        public IActionResult GetAllUsers()
        {
            try
            {
                var users = _context.Users.ToList();
                if (!users.Any())
                    return NotFound(new { message = "No users found" });

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve users.", error = ex.Message });
            }
        }

        // ✅ DELETE USER (requires token)
        [Authorize]
        [HttpDelete("{email}")]
        public IActionResult DeleteUser(string email)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.UserEmail == email);
                if (user == null)
                    return NotFound(new { message = $"User '{email}' not found" });

                _context.Users.Remove(user);
                _context.SaveChanges();

                return Ok(new { message = $"User '{email}' deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete user.", error = ex.Message });
            }
        }
    }

    // ✅ DTO for login
    public class LoginRequest
    {
        public string UserEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // ✅ DTO for login response
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
