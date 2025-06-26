using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Rental1.Models
{
    public class OwnerModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? Name { get; set; }

        public string Email { get; set; } = null!;

        public string? Mobile { get; set; } 

        public List<string>? Properties { get; set; }

        //[BsonElement("requests")]
        public List<RequestModel>? Requests { get; set; } = new();
    }

    public class RequestModel
    {
        public string? Description { get; set; }

        public string? LatentId { get; set; }

        public string? PropertyId { get; set; }

    }
}
