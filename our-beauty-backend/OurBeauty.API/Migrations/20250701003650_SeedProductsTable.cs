using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OurBeauty.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedProductsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Description", "ImageUrl", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "A vibrant and long-lasting lipstick that provides full coverage and a comfortable feel.", "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg", "Luxury Lipstick", 350m },
                    { 2, "A lightweight foundation that offers a natural, flawless finish for all skin types.", "https://images.pexels.com/photos/3373723/pexels-photo-3373723.jpeg", "Foundation Cream", 550m },
                    { 3, "A versatile palette with a mix of matte and shimmer shades to create endless eye looks.", "https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg", "Eyeshadow Palette", 750m },
                    { 4, "A powerful serum packed with vitamins to rejuvenate and hydrate your skin.", "https://images.pexels.com/photos/5863397/pexels-photo-5863397.jpeg", "Skincare Serum", 900m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
