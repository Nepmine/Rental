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

        public async Task<List<latentModel>> GetAllEntries() =>
        await _latentCollection.Find(_ => true).ToListAsync();

        public async Task CreateEntry(latentModel newJob) =>
         await _latentCollection.InsertOneAsync(newJob);
    }
}
