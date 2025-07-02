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


        [HttpGet("Profile")]
        public async Task<ProfileReturnDTO> getProfile(string id)
        {
            return await _latentService.getProfile(id);
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

        [HttpPost("AddFavourate")]
        public async Task<string> AddFavourate(string propertyId, string latentId)
        {
            return await _latentService.AddFavourate(propertyId, latentId);
        }

        [HttpPost("AllFavourates")]
        public async Task<List<PropertyModel>> AllFavourates(string latentId)
        {
            return await _latentService.AllFavourates(latentId);
        }

        [HttpPost("RequestForProperty")]
        public async Task<string> RequestForProperty(RequestModel newRequest)
        {
            await _latentService.RequestForProperty(newRequest);
            return "Request Submitted !";
        }

        [HttpGet("GetAllRequests")]
        public async Task<List<PropertyModel>> GetAllRequests(string latentId)
        {
            return await _latentService.GetAllRequests(latentId);
       
        }

    }
}
