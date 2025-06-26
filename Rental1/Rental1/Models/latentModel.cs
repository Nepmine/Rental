using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Rental1.Models;

namespace Rental1.Models
{
    public class latentModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Name { get; set; }

        public string Email { get; set; } = null!;

        public string? MobileNo { get; set; }

        public string? Description { get; set; }

        public List<RequestModel>? Requests { get; set; } = new();

        public List<String>? Favourites { get; set; }
    }
}
