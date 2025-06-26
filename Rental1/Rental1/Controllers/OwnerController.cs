using Microsoft.AspNetCore.Mvc;
using Rental1.Models;
using Rental1.Services;


namespace Rental1.Controllers
{
    [ApiController]
    [Route("owner/[controller]")]
    public class OwnerController : Controller
    {
            private readonly OwnerService _OwnerService;


        public OwnerController(OwnerService ownerService)
        {
            _OwnerService = ownerService;
        }

        [HttpGet]
        public async Task<List<OwnerModel>> allOwners()
        {
            return await _OwnerService.getAllOwners();
        }

        //public async Task<List<latentModel>> GetAll() => await _latentService.GetAllEntries();

        [HttpPost]
        public string Index(OwnerModel newOwner)
        {
            _OwnerService.CreateOwner(newOwner);
            return "Hello there !";
        }
    }
}
