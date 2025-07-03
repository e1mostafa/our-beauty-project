using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OurBeauty.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace OurBeauty.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configure CORS policy to allow both local development and deployed Vercel frontend
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins(
                            "http://localhost:3000", // Allow requests from your local React development server
                            "https://ourbeautyproject.vercel.app/" ,// Allow requests from your deployed Vercel frontend
                            "http://ourbeautyapi.runasp.net",
                             "https://ourbeautyapi.runasp.net"
                        )
                        .AllowAnyHeader() // Allow all headers
                        .AllowAnyMethod(); // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
                });
            });

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                // Configure Swagger to use JWT Bearer authentication
                options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\""
                });

                options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            // Get the database connection string from appsettings.json
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString));

            // Configure ASP.NET Core Identity
            builder.Services.AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            // Configure JWT Bearer Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Use HTTPS Redirection
            app.UseHttpsRedirection();

            // Use Static Files (if serving any from wwwroot)
            app.UseStaticFiles();

            // Enable routing
            app.UseRouting();

            // Apply the CORS policy. This must be placed after UseRouting() and before UseAuthentication()/UseAuthorization()
            app.UseCors("AllowReactApp");

            // Enable Authentication and Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // Map API controllers
            app.MapControllers();

            // Run the application
            app.Run();
        }
        // The public void ConfigureServices(IServiceCollection services) method was removed from here
        // as it's not standard for .NET 6+ minimal API Program.cs files.
    }
}