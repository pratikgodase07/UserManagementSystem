using Microsoft.EntityFrameworkCore;
using UserManagementAPI.Models;

namespace UserManagementAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed initial data
            modelBuilder.Entity<User>().HasData(
                new User { Id = 1, Name = "Rahul Patil",  Address = "Pune",   Salary = 45000 },
                new User { Id = 2, Name = "Sneha Joshi",  Address = "Mumbai", Salary = 52000 },
                new User { Id = 3, Name = "Amit Desai",   Address = "Nashik", Salary = 38000 }
            );
        }
    }
}
