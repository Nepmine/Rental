using Microsoft.AspNetCore.Mvc;
using Rental1.Services;
using Rental1.Models;
namespace Rental1.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class Rental1Controller : Controller
    {

        private readonly Rental1Service _rentalService;

        public Rental1Controller(Rental1Service rentalService)
        {
            _rentalService = rentalService;
        }

        // api/jobs
        [HttpGet]
        public async Task<List<userModel>> GetAll() => await _rentalService.GetAllEntries();


        // api/jobs
        [HttpPost]
        public async Task<IActionResult> Post(userModel newProperty)
        {
            await _rentalService.CreateEntry(newProperty);
            return CreatedAtAction("hhiiii", new { id = newProperty.Id }, newProperty);
        }
    }
}
