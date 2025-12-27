using Microsoft.EntityFrameworkCore;
using OracleAdminLoginAPI.Models;

namespace OracleAdminLoginAPI.Data
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options)
            : base(options)
        {
        }

        public DbSet<Admin> Admins { get; set; }
    }
}
