import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function CustomerForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    serviceType: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sending data:", formData); // Debug
    
    axios.post("http://localhost:5162/api/customer/save", formData)
      .then((res) => {
        console.log("Success:", res.data);
        alert(res.data.message || "Customer Saved Successfully");
        navigate("/home");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Error: " + (err.response?.data || err.message));
      });
};

  return (
    <div className="container">
      <h1>Customer Registration</h1>
      <h2>Register Your Company</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input
            name="companyName"
            placeholder="Enter company name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            name="address"
            placeholder="Enter address"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Person</label>
          <input
            name="contactPerson"
            placeholder="Enter contact person name"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Number</label>
          <input
            name="contactNumber"
            placeholder="Enter phone number"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Service Type</label>
          <input
            name="serviceType"
            placeholder="Enter service type"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Register Customer</button>
      </form>
    </div>
  );
}

export default CustomerForm;