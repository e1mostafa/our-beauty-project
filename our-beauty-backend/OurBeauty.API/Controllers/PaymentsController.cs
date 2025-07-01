using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OurBeauty.API.Data;
using Stripe;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace OurBeauty.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;

        public PaymentsController(IConfiguration config, ApplicationDbContext context)
        {
            _config = config;
            _context = context;
            StripeConfiguration.ApiKey = _config["Stripe:SecretKey"];
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<string>> CreatePaymentIntent()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var cart = await _context.ShoppingCarts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.Items.Any())
            {
                return BadRequest("Cart is empty.");
            }

            var service = new PaymentIntentService();
            var intent = new PaymentIntent();

            // Calculate the total amount in the smallest currency unit (cents/piastres)
            var totalAmount = (long)cart.Items.Sum(i => i.Product.Price * i.Quantity) * 100;

            var options = new PaymentIntentCreateOptions
            {
                Amount = totalAmount,
                Currency = "usd", // Or "egp", etc.
                PaymentMethodTypes = new List<string> { "card" },
            };

            intent = await service.CreateAsync(options);

            return Ok(new { clientSecret = intent.ClientSecret });
        }
    }
}