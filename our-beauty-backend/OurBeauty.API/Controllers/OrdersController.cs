using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OurBeauty.API.Data;
using OurBeauty.API.Models;
using System.Security.Claims;

namespace OurBeauty.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public OrdersController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // Replace the old CreateOrder method with this one
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cart = await _context.ShoppingCarts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest("Shopping cart is empty.");
            }

            // Create a new order and set the payment method
            var order = new Order
            {
                UserId = userId,
                TotalPrice = cart.Items.Sum(item => item.Quantity * item.Product.Price),
                PaymentMethod = createOrderDto.PaymentMethod // Set payment method from request
            };

            foreach (var cartItem in cart.Items)
            {
                var orderItem = new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    Price = cartItem.Product.Price
                };
                order.OrderItems.Add(orderItem);
            }

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cart.Items);

            var result = await _context.SaveChangesAsync();

            if (result > 0)
            {
                return CreatedAtAction("GetOrder", new { id = order.Id }, order);
            }

            return BadRequest("Problem creating order.");
        }

        // A method to get an order by ID (for the CreatedAtAction result)
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderItems)
                .ThenInclude(i => i.Product)
                .OrderByDescending(o => o.OrderDate) // Show most recent orders first
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return Ok(new List<Order>()); // Return an empty list instead of NotFound
            }

            return Ok(orders);
        }
    }
}