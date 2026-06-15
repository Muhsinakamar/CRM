import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerForm from "./pages/CustomerForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InvoiceForm from "./pages/InvoiceForm";
import "./App.css";

function Home() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5163/api/customer/latest")
      .then(res => {
        setCustomer(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return (
    <div className="container">
      {/* Welcome Banner */}
      {customer && (
        <div className="welcome-message">
          <h1>Welcome {customer.companyName} 🎉</h1>
        </div>
      )}

      <h2>Registered Customer Details</h2>

      {customer ? (
        <table>
          <tbody>
            <tr>
              <th>Company</th>
              <td>{customer.companyName}</td>
            </tr>
            <tr>
              <th>Contact Person</th>
              <td>{customer.contactPerson}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{customer.contactNumber}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{customer.email}</td>
            </tr>
            <tr>
              <th>Service</th>
              <td>{customer.serviceType}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No customer found. Please register first.</p>
      )}

      <button onClick={() => navigate("/invoice")}>
        Create Invoice
      </button>
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