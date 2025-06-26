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


        [HttpPost("OwnerRegister")]
        public async Task<string> OwnerRegister(OwnerModel newOwner)
        {
            return await _OwnerService.OwnerRegister(newOwner);
        }

        [HttpPost("OwnerLogin")]
        public async Task<string> OwnerLogin(string email, string password)
        {
            return await _OwnerService.OwnerLogin(email, password);
        }
    }
}
