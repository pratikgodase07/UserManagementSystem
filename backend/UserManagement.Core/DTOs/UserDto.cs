namespace UserManagement.Core.DTOs
{
    /// <summary>
    /// DTO for creating or updating a user
    /// Separates API contract from domain entity
    /// </summary>
    public class UserDto
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Salary { get; set; }
    }

    /// <summary>
    /// DTO for returning user data (includes Id)
    /// </summary>
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Salary { get; set; }
    }
}
