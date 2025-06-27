using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Rental1.Models;
using System.Collections.Generic;

namespace Rental1.Services
{
    public class PropertyService
    {
        public readonly IMongoCollection<PropertyModel> _propertyCollection;

        public PropertyService(IOptions<DatabaseSetting> RentalDatabaseSetting)
        {
            var mongoClient = new MongoClient(RentalDatabaseSetting.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(RentalDatabaseSetting.Value.DatabaseName);
            _propertyCollection = mongoDatabase.GetCollection<PropertyModel>(RentalDatabaseSetting.Value.PropertyCollectionName);
        }

        // get a single property ..
        public async Task<PropertyModel> getPropertyById(string propertyId)
        {
           return await _propertyCollection.Find(x => x.Id == propertyId).FirstOrDefaultAsync();
        }
        

        public async Task<List<PropertyModel>> GetAllEntries() =>
        await _propertyCollection.Find(_ => true).ToListAsync();

        public async Task CreateEntry(PropertyModel newProp) =>
         await _propertyCollection.InsertOneAsync(newProp);



        //   --------------- External Helper Functions --------------------

            // incriment the count of likes of property by 1
        public async Task AddPropertyLike(string propertyId)
        {
            PropertyModel Property = await _propertyCollection.Find(x => x.Id == propertyId).FirstOrDefaultAsync();
            ++Property.Likes;
            await _propertyCollection.ReplaceOneAsync(x => x.Id == propertyId, Property);

        }


        public async Task<List<PropertyModel>> AllFavourateProperties(List<string> allFavs)
        {
            //PropertyModel Property = await _propertyCollection.Find(x => x.Id == propertyId).FirstOrDefaultAsync();  ------- map with favproperties list

            var filter = Builders<PropertyModel>.Filter.In(p => p.Id, allFavs);
            return await _propertyCollection.Find(filter).ToListAsync();

        }


        public async Task UpdateProperty(PropertyModel property)
        {
            await _propertyCollection.ReplaceOneAsync(x =>x.Id==property.Id, property);
        }
    }
}
