using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using System.ComponentModel.DataAnnotations;

namespace Rental1.Models
{
    public class PropertyModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? Name { get; set; }

        public string? propDesc { get; set; }

        public string Status { get; set; } = "Available";

        public PriceDetails? Price { get; set; } = new();

        //public Location? location { get; set; } = new();

        //public GeoJsonPoint? Location { get; set; }

        public GeoJsonPoint<GeoJson2DGeographicCoordinates>? Location { get; set; }

        public List<Feature>? features { get; set; } = new();

        public int Likes { get; set; } = 0;

        public string? OwnerId { get; set; }

        // like family only, married, no bachelors, no dead
        public List<string> Preferences { get; set; } = new(["Any"]);

        public List<Photos>? photos { get; set; } = new();

        
    }

    public class Photos
    {
        [Required]
        public string title { get; set; } = null!;

        public string? photoDesc { get; set; } // I have a gijer in my bathroom for you :)

        [Required]
        public string profilePhoto { get; set; } = null!;

        [Required]
        public List<string> photoPath { get; set; } =new();
    }

    //public class Location
    //{
    //    [Required]
    //    public Double longitude { get; set; }

    //    [Required]
    //    public Double latitude { get; set; }
    //}

    public class GeoJsonPoint
    {
        [MongoDB.Bson.Serialization.Attributes.BsonElement("type")]
        public string Type { get; set; } = "Point";

        [MongoDB.Bson.Serialization.Attributes.BsonElement("coordinates")]
        public double[] Coordinates { get; set; } = new double[2];
    }

    public class PriceDetails
    {
        public Decimal? SellingPrice { get; set; }

        public Decimal? Rent {  get; set; }

        public Decimal? Deposit {  get; set; }
    }

    public class Feature
    {
        [Required]
        public string featureName { get; set; } = null!;

        public string? featureDesc { get; set; }
    }
}
