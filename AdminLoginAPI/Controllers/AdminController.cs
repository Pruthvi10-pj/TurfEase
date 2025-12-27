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
    public class AdminController : ControllerBase
    {
        private readonly AdminDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminController(AdminDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // LOGIN (no authorization required)
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] Admin loginRequest)
        {
            if (string.IsNullOrWhiteSpace(loginRequest.Username) || string.IsNullOrWhiteSpace(loginRequest.Password))
                return BadRequest(new { message = "Username and Password are required" });

            var admin = _context.Admins.FirstOrDefault(a =>
                a.Username == loginRequest.Username && a.Password == loginRequest.Password);

            if (admin == null)
                return Unauthorized(new { message = "Invalid credentials" });

            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, admin.Username)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new LoginResponse { Token = tokenString, Message = "Login successful" });
        }

        // ADD ADMIN (requires login)
        [Authorize]
        [HttpPost]
        public IActionResult AddAdmin([FromBody] Admin newAdmin)
        {
            if (string.IsNullOrWhiteSpace(newAdmin.Username) || string.IsNullOrWhiteSpace(newAdmin.Password))
                return BadRequest(new { message = "Username and Password are required" });

            _context.Admins.Add(newAdmin);
            _context.SaveChanges();

            return Ok(new { message = "Admin added successfully" });
        }

        // GET ALL ADMINS (requires login)
        [Authorize]
        [HttpGet]
        public IActionResult GetAllAdmins()
        {
            var admins = _context.Admins.ToList();
            if (!admins.Any())
                return NotFound(new { message = "No admins found" });

            return Ok(admins);
        }

        // DELETE ADMIN (requires login)
        [Authorize]
        [HttpDelete("{username}")]
        public IActionResult DeleteAdmin(string username)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.Username == username);
            if (admin == null)
                return NotFound(new { message = $"Admin '{username}' not found" });

            _context.Admins.Remove(admin);
            _context.SaveChanges();

            return Ok(new { message = $"Admin '{username}' deleted successfully" });
        }
    }
}
