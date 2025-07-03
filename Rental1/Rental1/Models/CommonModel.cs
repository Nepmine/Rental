using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;


namespace Rental1.Models
{
    public class ProfileReturnDTO
    {
        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? Mobile { get; set; }

    }

    public class loginDataModel
    {
        public string email { get; set; }

        public string password { get; set; }
    }
}
