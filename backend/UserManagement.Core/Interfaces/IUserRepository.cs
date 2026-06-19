using UserManagement.Core.Entities;

namespace UserManagement.Core.Interfaces
{
    /// <summary>
    /// Repository Pattern: Interface defined in Core (no dependency on Infrastructure)
    /// Any concrete implementation (EF Core, Dapper, etc.) must implement this contract
    /// </summary>
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User> CreateAsync(User user);
        Task<User?> UpdateAsync(int id, User user);
        Task<bool> DeleteAsync(int id);
    }
}
