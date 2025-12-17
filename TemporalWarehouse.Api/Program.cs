using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using YourProjectNamespace.Data; // if you use Swagger customization
// other using statements...

var builder = WebApplication.CreateBuilder(args);

// ===== ADD THIS: Configure CORS =====
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Your React dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
        // You can also use .AllowCredentials() if needed (but avoid with AllowAnyOrigin)
    });
});

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Your DB context setup
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// ===== USE CORS MIDDLEWARE (MUST be before UseRouting/UseEndpoints) =====
app.UseCors("AllowLocalFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization(); // if using auth, otherwise not needed
app.MapControllers();

app.Run();