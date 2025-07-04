using Microsoft.AspNetCore.Mvc;
using Rental1.Models;
using Rental1.Services;


namespace Rental1.Controllers
{
    [ApiController]
    [Route("owner/")]
    public class OwnerController : Controller
    {
            private readonly OwnerService _OwnerService;
        public OwnerController(OwnerService ownerService)
        {
            _OwnerService = ownerService;
        }

        //     ---------------------   ALL API's   -----------------------------

        [HttpGet("Profile")]
        public async Task<ProfileReturnDTO> getProfile(string id)
        {
            return await _OwnerService.getProfile(id);
        }

        [HttpPost("OwnerRegister")]
        public async Task<string> OwnerRegister(OwnerModel newOwner)
        {
            return await _OwnerService.OwnerRegister(newOwner);
        }

        [HttpPost("OwnerLogin")]
        public async Task<string> OwnerLogin(loginDataModel loginData)
        {
            return await _OwnerService.OwnerLogin(loginData.email, loginData.password);
        }


        [HttpGet("GetAllRequests")]
        public async Task<List<PropertyModel>> GetAllRequests(string ownerId)
        {
            return await _OwnerService.GetAllRequests(ownerId);

        }

        [HttpGet("myAllProperties")]
        public async Task<List<PropertyModel>> myAllProperties(string ownerId)
        {
            return await _OwnerService.myAllProperties(ownerId);

        }

        [HttpPut("UpdateProfile")]
        public async Task<string> UpdateProfile(UpdateProfileModel profile)
        {
            await _OwnerService.UpdateProfile(profile);
            return "Profile Updated !";
        }
    }
}
