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

        [HttpGet("getPropertyById")]
        public async Task<PropertyModel> getPropertyById(string propertyId) => await _propertyService.getPropertyById(propertyId);

        [HttpGet("getAllProperties")]
        public async Task<List<PropertyModel>> GetAll() => await _propertyService.GetAllEntries();

        [HttpPost]
        public async Task<string> Post(PropertyModel newLatent)
        {
            await _propertyService.CreateEntry(newLatent);
            return "Property Details Added !";
        }

        [HttpPut("UpdatePropertyStatus")]
        public async Task<string> UpdatePropertyStatus(string propertyId, string status)
        {
            await _propertyService.UpdatePropertyStatus(propertyId, status);
            return "Property Status updated !";
        }



        [HttpPut("UpdateProperty")]
        public async Task<string> UpdateProperty(PropertyModel property)
        {
            await _propertyService.UpdateProperty(property);
            return "Property Updated !";
        }
    }
}
