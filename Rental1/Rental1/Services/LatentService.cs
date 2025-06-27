using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Rental1.Models;
using Rental1.Services;

namespace Rental1.Services
{
    public class LatentService
    {
        public readonly IMongoCollection<latentModel> _latentCollection;
        private PropertyService _propertyService;

        public LatentService(IOptions<DatabaseSetting> RentalDatabaseSetting, PropertyService propertyService)
        {
            var mongoClient = new MongoClient(RentalDatabaseSetting.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(RentalDatabaseSetting.Value.DatabaseName);
            _latentCollection = mongoDatabase.GetCollection<latentModel>(RentalDatabaseSetting.Value.LatentCollectionName);

            _propertyService = propertyService;
        }


        //     ---------------------   ALL API's   -----------------------------


        public async Task<ProfileReturnDTO> getProfile(string id)
        {
            latentModel Latent = await _latentCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
            if (Latent == null)
            {
                throw new KeyNotFoundException("Latent not found");
            }

            return new ProfileReturnDTO
            {
                Name = Latent.Name,
                Email = Latent.Email,
                Mobile = Latent.Mobile
            };
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


        public async Task<string> AddFavourate(string propertyId, string latentId)
        {
            // add the propertyid to the latent's profile
            latentModel Latent = await _latentCollection.Find(x => x.Id == latentId).FirstOrDefaultAsync();
            //latentModel Latent = await _latentCollection.ReplaceOneAsync(x => x.Id == latentId, );


            if (Latent == null)
            {
                throw new KeyNotFoundException("Latent not found");
            }
            if(Latent.Favourites == null)
            {
                Latent.Favourites = new List<string>();
            }
            Latent.Favourites.Add(propertyId);

            await _latentCollection.ReplaceOneAsync(x => x.Id == latentId, Latent);
            


            // incriment the count of likes of property by 1
            await _propertyService.AddPropertyLike(propertyId);

            return "Liked ;)";
        }





    public async Task<List<PropertyModel>> AllFavourates(string latentId)
        {
            latentModel Latent = await _latentCollection.Find(x => x.Id == latentId).FirstOrDefaultAsync();


            if (Latent == null)
            {
                throw new KeyNotFoundException("Latent not found");
            }
            if (Latent.Favourites == null)
            {
                return [];
            }

            return await _propertyService.AllFavourateProperties(Latent.Favourites);
        }
    }



}
