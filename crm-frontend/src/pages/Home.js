import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ FETCH LATEST CUSTOMER FROM DATABASE
    axios.get("http://localhost:5163/api/customer/latest")
      .then((res) => {
        setCustomer(res.data); // Assuming API returns the customer object
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching customer:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registered Customer Details</h2>

      {/* ✅ TABLE DISPLAYING THE FETCHED CUSTOMER */}
      {customer ? (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Service</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{customer.companyName}</td>
              <td>{customer.contactPerson}</td>
              <td>{customer.contactNumber}</td>
              <td>{customer.email}</td>
              <td>{customer.serviceType}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No customer data found.</p>
      )}

      <br />

      <button onClick={() => navigate("/invoice")}>
        Create Invoice
      </button>
    </div>
  );
}

export default Home;