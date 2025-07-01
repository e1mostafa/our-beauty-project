namespace OurBeauty.API.DTOs // << تأكد من هذا السطر
{
    using System.ComponentModel.DataAnnotations;

    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }
}