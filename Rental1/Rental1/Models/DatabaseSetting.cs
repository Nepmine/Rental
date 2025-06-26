namespace Rental1.Models
{
    public class DatabaseSetting
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string LatentCollectionName { get; set; } = "Latent1";
        public string OwnerCollectionName { get; set; } = "Owner";
        public string PropertyCollectionName { get; set; } = "Property";
    }
}
