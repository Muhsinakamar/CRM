import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerForm from "./pages/CustomerForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InvoiceForm from "./pages/InvoiceForm";

function Home() {
    const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5162/api/customer")
      .then(res => {
        setCustomers(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer List</h2>

      {/* ✅ TABLE */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Service</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, index) => (
            <tr key={index}>
              <td>{c.companyName}</td>
              <td>{c.contactPerson}</td>
              <td>{c.contactNumber}</td>
              <td>{c.email}</td>
              <td>{c.serviceType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {/* ✅ CREATE INVOICE BUTTON */}
      <button onClick={() => navigate("/invoice")}>
        Create Invoice
      </button>
    </div>
  );
  return (
    <div>
      <h1>Home Page</h1>
      <h2>Welcome Customer</h2>
      <p>You have Registered Successfully 🎉</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/invoice" element={<InvoiceForm />} />
      </Routes>
    </Router>
  );
}

export default App;