using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using Rental1.Models;
using Rental1.Services;
using System.Data;

namespace Rental1.Controllers
{
    [ApiController]
    [Route("property/[controller]")]
    public class PropertyController : Controller
    {
        private readonly PropertyService _propertyService;
        private readonly OwnerService _ownerService;


        public PropertyController(PropertyService propertyService, OwnerService ownerService)
        {
            _propertyService = propertyService;
            _ownerService = ownerService;
        }

        [HttpGet("getPropertyById")]
        public async Task<PropertyModel> getPropertyById(string propertyId) => await _propertyService.getPropertyById(propertyId);

        [HttpGet("getAllProperties")]
        public async Task<List<PropertyModel>> GetAll() => await _propertyService.GetAllEntries();

        //here while adding property converting the address to cords 
        [HttpPost("addProperty")]
        public async Task<string> CreateProperty([FromBody] PropertyModel input)
        {
            var coords = await _propertyService.changePlaceToCords(input.Address);

            input.Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                new GeoJson2DGeographicCoordinates((double)coords.Lon, (double)coords.Lat)
            );

            string propertyId = await _propertyService.CreateProperty(input);

            // passed propertyId and ownerId
            await _ownerService.SavePropertyIdToOwner(input.OwnerId, propertyId);

            return "Property added successfully!";
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

        //location controller
        [HttpGet("searchByLocation")]
        public async Task<List<PropertyReturnModel>> SearchByLocation(
        [FromQuery] string location,
        [FromQuery] double distanceInMeters = 15000)
        {
            List<PropertyReturnModel> redisAnswer =await _propertyService.checkCache(location);  // we were here, check the cache making a function returning properties or null !
            //get cords
            if(redisAnswer != null)
            {
                return redisAnswer;
            }
            var coords = await _propertyService.changePlaceToCords(location);

            //searching props near to cords
            return await _propertyService.SearchPropertiesNear( (double)coords.Lon, (double)coords.Lat,distanceInMeters , location);
        }

    }
}
