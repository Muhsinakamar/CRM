namespace Crm1.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string CompanyName { get; set; } = "";
        public string Address { get; set; } = "";
        public string ContactPerson { get; set; } = "";
        public string ContactNumber { get; set; } = "";
        public string Email { get; set; } = "";
        public string ServiceType { get; set; } = "";
    }
}
