using Microsoft.AspNetCore.Mvc;
using Rental1.Models;
using Rental1.Services;

namespace Rental1.Controllers
{
    [ApiController]
    [Route("property/[controller]")]
    public class PropertyController : Controller
    {
        private readonly PropertyService _propertyService;

        public PropertyController(PropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpGet]
        public async Task<List<PropertyModel>> GetAll() => await _propertyService.GetAllEntries();

        [HttpPost]
        public async Task<string> Post(PropertyModel newLatent)
        {
            await _propertyService.CreateEntry(newLatent);
            return "Property Details Added !";
        }
    }
}
