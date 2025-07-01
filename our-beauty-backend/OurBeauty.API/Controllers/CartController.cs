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
    [Authorize] // This entire controller requires the user to be logged in
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public CartController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<ShoppingCart>> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Gets the logged-in user's ID

            var cart = await _context.ShoppingCarts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product) // This loads the product details for each cart item
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                // If user has no cart, create one
                cart = new ShoppingCart { Id = Guid.NewGuid(), UserId = userId };
                _context.ShoppingCarts.Add(cart);
                await _context.SaveChangesAsync();
            }

            return Ok(cart);
        }

        [HttpPost("items")]
        public async Task<ActionResult> AddItemToCart(int productId, int quantity = 1)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var cart = await _context.ShoppingCarts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new ShoppingCart { Id = Guid.NewGuid(), UserId = userId };
                _context.ShoppingCarts.Add(cart);
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);

            if (cartItem != null)
            {
                // If item exists, increase quantity
                cartItem.Quantity += quantity;
            }
            else
            {
                // If item does not exist, add it
                cart.Items.Add(new CartItem { ProductId = productId, Quantity = quantity });
            }

            var result = await _context.SaveChangesAsync();

            if (result > 0) return CreatedAtAction("GetCart", new { });

            return BadRequest("Problem saving item to cart");
        }
        // Add this new method to your CartController.cs
        [HttpDelete("items/{productId}")]
        public async Task<ActionResult> RemoveItemFromCart(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var cart = await _context.ShoppingCarts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            var cartItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);

            if (cartItem == null)
            {
                return NotFound("Item not in cart.");
            }

            // Remove the item from the context
            _context.CartItems.Remove(cartItem);

            var result = await _context.SaveChangesAsync();

            if (result > 0) return Ok();

            return BadRequest("Problem removing item from cart.");
        }
    }
}