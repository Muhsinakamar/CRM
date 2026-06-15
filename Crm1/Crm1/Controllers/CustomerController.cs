using Crm1.Models;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Collections.Generic;

namespace Crm1.Controllers
{
    [ApiController]
    [Route("api/customer")]
    public class CustomerController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public CustomerController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("Server 1 is running!");
        }

        [HttpGet("dbtest")]
        public IActionResult DbTest()
        {
            try
            {
                string connString = _configuration.GetConnectionString("DefaultConnection");
                using (NpgsqlConnection con = new NpgsqlConnection(connString))
                {
                    con.Open();
                }
                return Ok("Database Connected Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("DB Error: " + ex.Message);
            }
        }

        [HttpPost("save")]
        public IActionResult Save([FromBody] Customer customer)
        {
            try
            {
                if (customer == null)
                {
                    return BadRequest("Customer data is null");
                }

                string connString = _configuration.GetConnectionString("DefaultConnection");

                using (NpgsqlConnection con = new NpgsqlConnection(connString))
                {
                    con.Open();

                    string query = @"
                        INSERT INTO customers
                        (company_name, address, contact_person, contact_number, email, service_type)
                        VALUES
                        (@company_name, @address, @contact_person, @contact_number, @email, @service_type)";

                    using (NpgsqlCommand cmd = new NpgsqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("company_name", customer.CompanyName ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("address", customer.Address ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("contact_person", customer.ContactPerson ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("contact_number", customer.ContactNumber ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("email", customer.Email ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("service_type", customer.ServiceType ?? (object)DBNull.Value);

                        cmd.ExecuteNonQuery();
                    }
                }

                return Ok(new { message = "Customer Saved Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest("ERROR: " + ex.Message);
            }
        }
    }
}