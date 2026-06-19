using Microsoft.EntityFrameworkCore;
using UserManagement.Core.Interfaces;
using UserManagement.Infrastructure.Data;
using UserManagement.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE REGISTRATION (Dependency Injection Container)
// ─────────────────────────────────────────────────────────────────────────────

// MVC Controllers
builder.Services.AddControllers();

// Entity Framework Core with SQLite
// Database file: users.db in project root
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=users.db"));

// Repository Pattern: bind interface → implementation
// Scoped = one instance per HTTP request (correct for EF Core)
builder.Services.AddScoped<IUserRepository, UserRepository>();

// CORS: Allow React frontend (localhost:5173 = Vite dev server)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger/OpenAPI for testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE PIPELINE
// ─────────────────────────────────────────────────────────────────────────────

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");   // Must be before MapControllers
app.UseAuthorization();
app.MapControllers();

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-MIGRATE DATABASE ON STARTUP
// Creates users.db and seeds data if it doesn't exist
// ─────────────────────────────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();
