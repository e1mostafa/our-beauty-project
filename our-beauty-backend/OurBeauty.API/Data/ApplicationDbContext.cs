using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OurBeauty.API.Models;

namespace OurBeauty.API.Data
{
    // تغيير هنا: أصبح يرث من IdentityDbContext
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        public DbSet<ShoppingCart> ShoppingCarts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // كود إضافة المنتجات الأولية يبقى كما هو
            modelBuilder.Entity<Product>().HasData(
                new Product { Id = 1, Name = "Luxury Lipstick", Price = 350, Description = "A vibrant and long-lasting lipstick...", ImageUrl = "https://..." },
                new Product { Id = 2, Name = "Foundation Cream", Price = 550, Description = "A lightweight foundation...", ImageUrl = "https://..." },
                new Product { Id = 3, Name = "Eyeshadow Palette", Price = 750, Description = "A versatile palette...", ImageUrl = "https://..." },
                new Product { Id = 4, Name = "Skincare Serum", Price = 900, Description = "A powerful serum...", ImageUrl = "https://..." }
            );
        }
    }
}