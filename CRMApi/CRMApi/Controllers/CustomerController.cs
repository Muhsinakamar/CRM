using Microsoft.AspNetCore.Mvc;
using Npgsql;
using CRMApi.Models;

namespace CRMApi.Controllers
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

        // ✅ TEST DB
        [HttpGet("dbtest")]
        public IActionResult DbTest()
        {
            string connString = _configuration.GetConnectionString("DefaultConnection");

            using (NpgsqlConnection con = new NpgsqlConnection(connString))
            {
                con.Open();
            }

            return Ok("Database Connected Successfully");
        }

        // ✅ SAVE CUSTOMER
        [HttpPost("save")]
        public IActionResult Save([FromBody] Customer customer)
        {
            try
            {
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
                        cmd.Parameters.AddWithValue("@company_name", customer.CompanyName ?? "");
                        cmd.Parameters.AddWithValue("@address", customer.Address ?? "");
                        cmd.Parameters.AddWithValue("@contact_person", customer.ContactPerson ?? "");
                        cmd.Parameters.AddWithValue("@contact_number", customer.ContactNumber ?? "");
                        cmd.Parameters.AddWithValue("@email", customer.Email ?? "");
                        cmd.Parameters.AddWithValue("@service_type", customer.ServiceType ?? "");

                        cmd.ExecuteNonQuery();
                    }
                }

                return Ok("Customer Saved Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("ERROR: " + ex.Message);
            }
        }

        // ✅ GET ALL CUSTOMERS
        [HttpGet("latest")]
        public IActionResult GetLatest()
        {
            try
            {
                string connString = _configuration.GetConnectionString("DefaultConnection");
                Console.WriteLine("Connection String: " + connString);  // ✅ DEBUG

                using (NpgsqlConnection con = new NpgsqlConnection(connString))
                {
                    con.Open();
                    Console.WriteLine("Database Connected!");  // ✅ DEBUG

                    string query = "SELECT * FROM customers ORDER BY customer_id DESC LIMIT 1";

                    using (NpgsqlCommand cmd = new NpgsqlCommand(query, con))
                    using (NpgsqlDataReader dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            var customer = new Customer
                            {
                                CustomerId = Convert.ToInt32(dr["customer_id"]),
                                CompanyName = dr["company_name"]?.ToString() ?? "",
                                Address = dr["address"]?.ToString() ?? "",
                                ContactPerson = dr["contact_person"]?.ToString() ?? "",
                                ContactNumber = dr["contact_number"]?.ToString() ?? "",
                                Email = dr["email"]?.ToString() ?? "",
                                ServiceType = dr["service_type"]?.ToString() ?? ""
                            };

                            Console.WriteLine("Customer Found: " + customer.CompanyName);  // ✅ DEBUG
                            return Ok(customer);
                        }
                    }
                }

                return Ok(null); // No customer found
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR: " + ex.Message);  // ✅ DEBUG
                return BadRequest(ex.Message);
            }
        }
    }
    }