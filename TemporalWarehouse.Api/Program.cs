using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
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


// ===== ADD THIS: Configure JWT Authentication =====
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("Jwt");
    var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// ===== USE CORS MIDDLEWARE (MUST be before UseRouting/UseEndpoints) =====
app.UseCors("AllowLocalFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();   // ← identifies the user (reads JWT token)
app.UseAuthorization();    // ← checks if user has permission
app.MapControllers();

app.Run();