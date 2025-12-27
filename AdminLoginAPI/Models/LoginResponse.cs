using System.ComponentModel.DataAnnotations;
namespace OracleAdminLoginAPI.Models
{
    public class LoginResponse
    {
        public string? Token { get; set; }
        public string? Message { get; set; }
    }
}