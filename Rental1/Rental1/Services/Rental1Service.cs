using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Rental1.Models;

namespace Rental1.Services
{
    public class Rental1Service
    {
        public readonly IMongoCollection<userModel> _userCollection;

        public Rental1Service(IOptions<DatabaseSetting> RentalDatabaseSetting)
        {
            var mongoClient = new MongoClient(RentalDatabaseSetting.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(RentalDatabaseSetting.Value.DatabaseName);
            _userCollection = mongoDatabase.GetCollection<userModel>(RentalDatabaseSetting.Value.CollectionName);
        }

        public async Task<List<userModel>> GetAllEntries() =>
        await _userCollection.Find(_ => true).ToListAsync();

        public async Task CreateEntry(userModel newJob) =>
         await _userCollection.InsertOneAsync(newJob);
    }
}
