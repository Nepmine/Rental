using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using Rental1.Models;
using System.Collections.Generic;
using System.Net;
using System.Text.Json;

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

            // Create 2dsphere index if it does not exist
            var indexKeysDefinition = Builders<PropertyModel>.IndexKeys.Geo2DSphere(x => x.Location);
            var indexModel = new CreateIndexModel<PropertyModel>(indexKeysDefinition);

            _propertyCollection.Indexes.CreateOne(indexModel);
        }

        // get a single property ..
        public async Task<PropertyModel> getPropertyById(string propertyId)
        {
           return await _propertyCollection.Find(x => x.Id == propertyId).FirstOrDefaultAsync();
        }
        

        public async Task<List<PropertyModel>> GetAllEntries() =>
        await _propertyCollection.Find(_ => true).ToListAsync();

        public async Task CreateEntry(PropertyModel property)
        {
            await _propertyCollection.InsertOneAsync(property);
        }

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

        public async Task UpdatePropertyStatus(string propertyId, string status)
        {
            var update = Builders<PropertyModel>.Update.Set(x => x.Status, status);

            await _propertyCollection.UpdateOneAsync(x =>x.Id == propertyId, update);

        }

        public async Task UpdateProperty(PropertyModel property)
        {
            await _propertyCollection.ReplaceOneAsync(x =>x.Id==property.Id, property);
        }

        //location logic 
        //method to return the cords of the entered location
        public async Task<NominatimResult> changePlaceToCords(string locationName)
        {
            using var httpClient = new HttpClient();

            var url = $"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(locationName)}&format=json&limit=1";

            httpClient.DefaultRequestHeaders.Add("User-Agent", "YourRentalApp/1.0");

            var json = await httpClient.GetStringAsync(url);

            JsonDocument doc = JsonDocument.Parse(json);
            JsonElement root = doc.RootElement;

            if (root.GetArrayLength() == 0)
            {
                throw new InvalidOperationException($"No geocoding results found for address: '{locationName}'.");
            }

            JsonElement first = root[0];

            string lati = first.GetProperty("lat").GetString();
            string loni = first.GetProperty("lon").GetString();

            NominatimResult cords = new NominatimResult();

            cords.Lat = double.Parse(lati, System.Globalization.CultureInfo.InvariantCulture);
            cords.Lon = double.Parse(loni, System.Globalization.CultureInfo.InvariantCulture);

            return cords;
        }


        // Searching for properties near the coords(entered address)
        public async Task<List<PropertyModel>> SearchPropertiesNear(
            double longitude,
            double latitude,
            double distanceInMeters)
        {
            var point = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                new GeoJson2DGeographicCoordinates(longitude, latitude)
            );

            var filter = Builders<PropertyModel>.Filter.NearSphere(
                x => x.Location,
                point,
                maxDistance: distanceInMeters
            );

            return await _propertyCollection.Find(filter).ToListAsync();
        }


    }
}
