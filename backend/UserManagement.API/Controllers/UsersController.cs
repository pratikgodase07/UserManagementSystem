using Microsoft.AspNetCore.Mvc;
using UserManagement.Core.DTOs;
using UserManagement.Core.Entities;
using UserManagement.Core.Interfaces;

namespace UserManagement.API.Controllers
{
    /// <summary>
    /// MVC Pattern — Controller handles HTTP requests, delegates to Repository
    /// RESTful API: GET, POST, PUT, DELETE
    /// Route: /api/users
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        // Dependency Injection: IUserRepository is injected (not UserRepository directly)
        // This is the key principle of Clean Architecture + Repository Pattern
        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET /api/users  → Read all users
        // ─────────────────────────────────────────────────────────────────────
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
        {
            var users = await _userRepository.GetAllAsync();

            // Map Entity → DTO (keeps API contract separate from domain)
            var response = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Address = u.Address,
                Salary = u.Salary
            });

            return Ok(response);
        }

        // ─────────────────────────────────────────────────────────────────────
        // GET /api/users/{id}  → Read single user
        // ─────────────────────────────────────────────────────────────────────
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { message = $"User with id {id} not found." });

            return Ok(new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Address = user.Address,
                Salary = user.Salary
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // POST /api/users  → Create new user
        // ─────────────────────────────────────────────────────────────────────
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> Create([FromBody] UserDto dto)
        {
            // Map DTO → Entity
            var user = new User
            {
                Name = dto.Name,
                Address = dto.Address,
                Salary = dto.Salary
            };

            var created = await _userRepository.CreateAsync(user);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, new UserResponseDto
            {
                Id = created.Id,
                Name = created.Name,
                Address = created.Address,
                Salary = created.Salary
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // PUT /api/users/{id}  → Update existing user
        // ─────────────────────────────────────────────────────────────────────
        [HttpPut("{id}")]
        public async Task<ActionResult<UserResponseDto>> Update(int id, [FromBody] UserDto dto)
        {
            var user = new User
            {
                Name = dto.Name,
                Address = dto.Address,
                Salary = dto.Salary
            };

            var updated = await _userRepository.UpdateAsync(id, user);
            if (updated == null)
                return NotFound(new { message = $"User with id {id} not found." });

            return Ok(new UserResponseDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Address = updated.Address,
                Salary = updated.Salary
            });
        }

        // ─────────────────────────────────────────────────────────────────────
        // DELETE /api/users/{id}  → Delete user
        // ─────────────────────────────────────────────────────────────────────
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _userRepository.DeleteAsync(id);
            if (!deleted)
                return NotFound(new { message = $"User with id {id} not found." });

            return NoContent(); // 204 — success, no body
        }
    }
}
