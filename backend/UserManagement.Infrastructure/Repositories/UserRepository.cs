using Microsoft.EntityFrameworkCore;
using UserManagement.Core.Entities;
using UserManagement.Core.Interfaces;
using UserManagement.Infrastructure.Data;

namespace UserManagement.Infrastructure.Repositories
{
    /// <summary>
    /// Concrete implementation of IUserRepository using Entity Framework Core
    /// Repository Pattern: abstracts data access from business logic
    /// Infrastructure layer: implements Core interfaces
    /// </summary>
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        // Dependency Injection: AppDbContext is injected, not created here
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET all users from DB
        /// </summary>
        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        /// <summary>
        /// GET single user by ID — returns null if not found
        /// </summary>
        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        /// <summary>
        /// POST — Create a new user and save to DB
        /// </summary>
        public async Task<User> CreateAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        /// <summary>
        /// PUT — Update an existing user; returns null if not found
        /// </summary>
        public async Task<User?> UpdateAsync(int id, User updatedUser)
        {
            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null) return null;

            // Update only the fields that can change
            existingUser.Name = updatedUser.Name;
            existingUser.Address = updatedUser.Address;
            existingUser.Salary = updatedUser.Salary;

            await _context.SaveChangesAsync();
            return existingUser;
        }

        /// <summary>
        /// DELETE — Remove user by ID; returns false if not found
        /// </summary>
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
