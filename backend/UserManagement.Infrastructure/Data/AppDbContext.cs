using Microsoft.EntityFrameworkCore;
using UserManagement.Core.Entities;

namespace UserManagement.Infrastructure.Data
{
    /// <summary>
    /// Entity Framework Core DbContext
    /// Infrastructure layer: depends on Core, not the other way around
    /// Using SQLite for lightweight local development
    /// </summary>
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Salary).HasPrecision(18, 2);
            });

            // Seed data for testing
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "Rahul Patil", Address = "Pune", Salary = 45000 },
                new User { Id = 2, Name = "Sneha Joshi", Address = "Mumbai", Salary = 52000 }
            );
        }
    }
}
