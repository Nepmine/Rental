using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Rental1.Models;

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

        public async Task<List<PropertyModel>> GetAllEntries() =>
        await _propertyCollection.Find(_ => true).ToListAsync();

        public async Task CreateEntry(PropertyModel newProp) =>
         await _propertyCollection.InsertOneAsync(newProp);
    }
}
