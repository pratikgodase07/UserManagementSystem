namespace UserManagement.Core.Entities
{
    /// <summary>
    /// Core domain entity for User
    /// Clean Architecture: Domain layer has no dependencies
    /// </summary>
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Salary { get; set; }
    }
}
