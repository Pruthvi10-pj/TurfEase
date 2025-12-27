using System.ComponentModel.DataAnnotations;
namespace OracleAdminLoginAPI.Models
{
    public class Admin
    {

        [Key]
        public string? Username { get; set; }
        public string? Password { get; set; }

    }
}
