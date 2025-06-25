using MongoDB.Bson.Serialization.Attributes;

namespace Rental1.Models
{
    public class userModel
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? Name { get; set; }

        public string Email { get; set; } = null!;

        public string? ContactNo { get; set; }

    }
}
