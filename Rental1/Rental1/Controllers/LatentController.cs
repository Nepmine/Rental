using Microsoft.AspNetCore.Mvc;
using Rental1.Services;
using Rental1.Models;

namespace Rental1.Controllers
{
    [ApiController]
    [Route("latent/[controller]")]
    public class LatentController : Controller
    {
        private readonly LatentService _latentService;

        public LatentController(LatentService latentService)
        {
            _latentService = latentService;
        }

        [HttpPost("LatentRegister")]
        public async Task<string> LatentRegister(latentModel newLatent)
        {
            return await _latentService.LatentRegister(newLatent);
        }

        [HttpPost("LatentLogin")]
        public async Task<string> LatentLogin(string email, string password)
        {
            return await _latentService.LatentLogin(email, password);
        }
    }
}
