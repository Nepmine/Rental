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

        public async Task<List<OwnerModel>> getAllOwners() =>
        await _OwnerCollection.Find(_ => true).ToListAsync();

        public async Task<List<OwnerModel>> getOwner() =>
        await _OwnerCollection.Find(_ => true).ToListAsync();

        public async void CreateOwner(OwnerModel newOwner) =>
         await _OwnerCollection.InsertOneAsync(newOwner);
    }
}
