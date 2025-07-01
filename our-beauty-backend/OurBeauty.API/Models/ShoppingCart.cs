using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OurBeauty.API.Models
{
    public class ShoppingCart
    {
        [Key]
        public Guid Id { get; set; }

        // Foreign key to the user
        public string UserId { get; set; }

        public List<CartItem> Items { get; set; } = new();
    }
}