using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Rental1.Models;

namespace Rental1.Services
{
    public class OwnerService
    {
        public readonly IMongoCollection<OwnerModel> _OwnerCollection;

        public OwnerService(IOptions<DatabaseSetting> RentalDatabaseSetting)
        {
            var mongoClient = new MongoClient(RentalDatabaseSetting.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(RentalDatabaseSetting.Value.DatabaseName);
            _OwnerCollection = mongoDatabase.GetCollection<OwnerModel>(RentalDatabaseSetting.Value.OwnerCollectionName);
        }

        public async Task<ProfileReturnDTO> getProfile(string id)
        {
        OwnerModel Owner=await _OwnerCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if (Owner == null)
            {
                throw new KeyNotFoundException("Owner not found");
            }

            return new ProfileReturnDTO
            {
                Name = Owner.Name,
                Email = Owner.Email,
                Mobile = Owner.Mobile
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
                OwnerModel Owner= await _OwnerCollection.Find(x => x.Email == email).FirstOrDefaultAsync();
                if (Owner == null|| Owner.Password != password)
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
    }
}
