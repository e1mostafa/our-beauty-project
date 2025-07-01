using System.ComponentModel.DataAnnotations.Schema;

namespace OurBeauty.API.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18, 2)")]
        public decimal TotalPrice { get; set; }
        public List<OrderItem> OrderItems { get; set; } = new();
        public string PaymentMethod { get; set; } // <-- ADD THIS LINE

        // You would add shipping details here later
        // public string ShippingAddress { get; set; }
    }
}