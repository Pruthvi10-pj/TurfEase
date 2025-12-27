using Microsoft.EntityFrameworkCore;
using OracleAdminLoginAPI.Models;

namespace OracleAdminLoginAPI.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("USERS"); // Table name in all caps
                
                entity.Property(e => e.Id).HasColumnName("ID");
                entity.Property(e => e.FullName).HasColumnName("FULL_NAME");
                entity.Property(e => e.PhoneNumber).HasColumnName("PHONE_NUMBER");
                entity.Property(e => e.UserEmail).HasColumnName("USER_EMAIL");
                entity.Property(e => e.Password).HasColumnName("PASSWORD");
            });
        }
    }
}
