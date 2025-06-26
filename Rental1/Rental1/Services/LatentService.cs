using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Rental1.Models;

namespace Rental1.Services
{
    public class LatentService
    {
        public readonly IMongoCollection<latentModel> _latentCollection;

        public LatentService(IOptions<DatabaseSetting> RentalDatabaseSetting)
        {
            var mongoClient = new MongoClient(RentalDatabaseSetting.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(RentalDatabaseSetting.Value.DatabaseName);
            _latentCollection = mongoDatabase.GetCollection<latentModel>(RentalDatabaseSetting.Value.LatentCollectionName);
        }

        public async Task<string> LatentRegister(latentModel newlatent)
        {
            try
            {
                // We have to hash the password here !!   remaining :)
                await _latentCollection.InsertOneAsync(newlatent);
                return "Registered Successfully !";
            }
            catch (Exception ex)
            {
                return "Error while Registering latent /n Error: " + ex;
            }
        }


        public async Task<string> LatentLogin(string email, string password)
        {
            try
            {
                // convert the password to hash before checking ..
                latentModel latent = await _latentCollection.Find(x => x.Email == email).FirstOrDefaultAsync();
                if (latent == null || latent.Password != password)
                {
                    return "Error, Email or password Invalid !";
                }

                return "Logged in Successfully !";
            }
            catch (Exception ex)
            {
                return "Error while Registering latent /n Error: " + ex.Message;
            }
        }
    }
}
