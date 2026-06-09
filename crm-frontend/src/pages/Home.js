import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  axios.get("http://localhost:5162/api/customer/latest")
    .then(res => {
      console.log("API RESPONSE:", res.data);   // 👈 MUST ADD
      setCustomer(res.data);
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
}, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Latest Registered Customer</h2>

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
        <p>No customer found</p>
      )}

      <br />

      <button onClick={() => navigate("/invoice")}>
        Create Invoice
      </button>
    </div>
  );
}

export default Home;