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

        [HttpGet]
        public async Task<List<latentModel>> GetAll() => await _latentService.GetAllEntries();

        [HttpPost]
        public async Task<string> Post(latentModel newLatent)
        {
            await _latentService.CreateEntry(newLatent);
            return "Hello world !";
        }
    }
}
