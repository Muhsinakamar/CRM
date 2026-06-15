using Crm2.Models;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Collections.Generic;

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

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("Server 2 is running!");
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

        [HttpGet("all")]
        public IActionResult GetAll()
        {
            try
            {
                string connString = _configuration.GetConnectionString("DefaultConnection");
                List<Customer> customers = new List<Customer>();

                using (NpgsqlConnection con = new NpgsqlConnection(connString))
                {
                    con.Open();

                    string query = "SELECT customer_id, company_name, address, contact_person, contact_number, email, service_type FROM customers ORDER BY customer_id DESC";

                    using (NpgsqlCommand cmd = new NpgsqlCommand(query, con))
                    using (NpgsqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            customers.Add(new Customer
                            {
                                CustomerId = dr.GetInt32(0),
                                CompanyName = dr.IsDBNull(1) ? "" : dr.GetString(1),
                                Address = dr.IsDBNull(2) ? "" : dr.GetString(2),
                                ContactPerson = dr.IsDBNull(3) ? "" : dr.GetString(3),
                                ContactNumber = dr.IsDBNull(4) ? "" : dr.GetString(4),
                                Email = dr.IsDBNull(5) ? "" : dr.GetString(5),
                                ServiceType = dr.IsDBNull(6) ? "" : dr.GetString(6)
                            });
                        }
                    }
                }

                return Ok(customers);
            }
            catch (Exception ex)
            {
                return BadRequest("ERROR: " + ex.Message);
            }
        }

        [HttpGet("latest")]
        public IActionResult GetLatest()
        {
            try
            {
                string connString = _configuration.GetConnectionString("DefaultConnection");

                using (NpgsqlConnection con = new NpgsqlConnection(connString))
                {
                    con.Open();

                    string query = "SELECT customer_id, company_name, address, contact_person, contact_number, email, service_type FROM customers ORDER BY customer_id DESC LIMIT 1";

                    using (NpgsqlCommand cmd = new NpgsqlCommand(query, con))
                    using (NpgsqlDataReader dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            var customer = new Customer
                            {
                                CustomerId = dr.GetInt32(0),
                                CompanyName = dr.IsDBNull(1) ? "" : dr.GetString(1),
                                Address = dr.IsDBNull(2) ? "" : dr.GetString(2),
                                ContactPerson = dr.IsDBNull(3) ? "" : dr.GetString(3),
                                ContactNumber = dr.IsDBNull(4) ? "" : dr.GetString(4),
                                Email = dr.IsDBNull(5) ? "" : dr.GetString(5),
                                ServiceType = dr.IsDBNull(6) ? "" : dr.GetString(6)
                            };

                            return Ok(customer);
                        }
                    }
                }

                return Ok(null);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}