using System.ComponentModel.DataAnnotations.Schema;

namespace OurBeauty.API.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int Quantity { get; set; }

        // Foreign key to the product
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        // Foreign key to the shopping cart
        public Guid ShoppingCartId { get; set; }
    }
}