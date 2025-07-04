using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Pipelines.Sockets.Unofficial.Buffers;
using Rental1.Models;
using System.Data;

namespace Rental1.Services
{
    public class OwnerService
    {
        public readonly IMongoCollection<OwnerModel> _OwnerCollection;
        private PropertyService _propertyService;

        public OwnerService(IOptions<DatabaseSetting> RentalDatabaseSetting, PropertyService propertyService)
        {
            var mongoClient = new MongoClient(RentalDatabaseSetting.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(RentalDatabaseSetting.Value.DatabaseName);
            _OwnerCollection = mongoDatabase.GetCollection<OwnerModel>(RentalDatabaseSetting.Value.OwnerCollectionName);
            _propertyService = propertyService;
        }

        public async Task<ProfileReturnDTO> getProfile(string id)
        {
            OwnerModel Owner = await _OwnerCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if (Owner == null)
            {
                throw new KeyNotFoundException("Owner not found");
            }

            return new ProfileReturnDTO
            {
                Name = Owner.Name,
                Email = Owner.Email,
                Mobile = Owner.Mobile,
                Requests = Owner.Requests,
                Favourites = ["hi","gfjk"]
            };
        }


        public async Task<string> OwnerRegister(OwnerModel newOwner)
        {
            try
            {
                // We have to hash the password here !!   remaining :)
                await _OwnerCollection.InsertOneAsync(newOwner);
                return "Created Successfully !";
            }
            catch (Exception ex)
            {
                return "Error while Registering Owner /n Error: " + ex;
            }
        }


        public async Task<string> OwnerLogin(string email, string password)
        {
            try
            {
                // convert the password to hash before checking ..
                OwnerModel Owner = await _OwnerCollection.Find(x => x.Email == email).FirstOrDefaultAsync();
                if (Owner == null || Owner.Password != password)
                {
                    return "Error, Email or password Invalid !";
                }
                
                return Owner.Id;
            }
            catch (Exception ex)
            {
                return "Error while Registering Owner /n Error: " + ex.Message;
            }
        }






        // ----------------------------------------- Extra -----------------------------------------

        public async Task<string> SendPropertyRequest(string email, string password)
        {
            try
            {
                // convert the password to hash before checking ..
                OwnerModel Owner = await _OwnerCollection.Find(x => x.Email == email).FirstOrDefaultAsync();
                if (Owner == null || Owner.Password != password)
                {
                    return "Error, Email or password Invalid !";
                }

                return "Logged in Successfully !";
            }
            catch (Exception ex)
            {
                return "Error while Registering Owner /n Error: " + ex.Message;
            }
        }

        public async Task SendPropertyRequest(RequestModel newRequest)
        {
            OwnerModel Owner = await _OwnerCollection.Find(x => x.Id == newRequest.OwnerId).FirstOrDefaultAsync();


            if (Owner == null)
            {
                throw new KeyNotFoundException("Owner not found");
            }
            if (Owner.Requests == null)
            {
                List<RequestModel> req = new List<RequestModel>();
                Owner.Requests = req;
            }
            Owner.Requests.Add(newRequest);
            await _OwnerCollection.ReplaceOneAsync(x => x.Id == Owner.Id, Owner);
        }



        public async Task<List<PropertyModel>> GetAllRequests(string ownerId)
        {
            // fetch request list
            // extract propertyId from each
            // extract property details from that propertyid calling AllFavourateProperties in propertyService

            OwnerModel Owner = await _OwnerCollection.Find(x => x.Id == ownerId).FirstOrDefaultAsync();


            if (Owner == null)
            {
                throw new KeyNotFoundException("Owner not found");
            }
            if (Owner.Requests == null)
            {
                return null;
            }
            List<string> requestPropertiesList = new List<string>();
            foreach (var item in Owner.Requests)
            {
                requestPropertiesList.Add(item.PropertyId);
            }
            return await _propertyService.AllFavourateProperties(requestPropertiesList);

        }

        // fetch request list
        // extract propertyId from each
        // extract property details from that propertyid calling AllFavourateProperties in propertyService
        public async Task<List<PropertyModel>> myAllProperties(string ownerId)
        {

            OwnerModel Owner = await _OwnerCollection.Find(x => x.Id == ownerId).FirstOrDefaultAsync();


            if (Owner == null)
            {
                throw new KeyNotFoundException("Owner not found");
            }
            if (Owner.Properties == null)
            {
                return null;
            }
            return await _propertyService.AllFavourateProperties(Owner.Properties);

        }

        public async Task SavePropertyIdToOwner(string ownerId, string propertyId)
        {
            OwnerModel owner = await _OwnerCollection.Find(x => x.Id == ownerId).FirstOrDefaultAsync();
            if (owner == null)
            {
                throw new KeyNotFoundException("Incorrect Owner ID");
            }
            if (owner.Properties == null)
            {
                List<string> Properties = new List<string>();
                Properties.Add(propertyId);
                owner.Properties=Properties;
            }
            else owner.Properties.Add(propertyId);

            await _OwnerCollection.ReplaceOneAsync(x => x.Id == ownerId, owner);

        }

        public async Task UpdateProfile(UpdateProfileModel profile)
        {
            var owner= await _OwnerCollection.Find(x => x.Email == profile.Email).FirstOrDefaultAsync();

            if (owner == null)
            {
                throw new KeyNotFoundException("Owner not found");
            }

            owner.Name = profile.Name;
            owner.Mobile = profile.Mobile;
            owner.Email=profile.Email;
            owner.Description = profile.Description;

            await _OwnerCollection.ReplaceOneAsync(x => x.Id == owner.Id, owner);
        }

    }
}

