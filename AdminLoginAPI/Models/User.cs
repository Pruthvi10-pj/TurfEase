using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OracleAdminLoginAPI.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public int? Id { get; set; }

        [Required]
        [Column("full_name")]
        public string? FullName { get; set; }

        [Required]
        [Column("phone_number")]
        public string? PhoneNumber { get; set; }

        [Required]
        [Column("user_email")]
        public string? UserEmail { get; set; }

        [Required]
        [Column("password")]
        public string? Password { get; set; }
    }
}
