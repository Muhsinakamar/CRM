import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerForm() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    serviceType: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const saveCustomer = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5162/api/customer/save", formData);
      alert("Customer Saved Successfully");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Error saving customer");
    }
  };

  return (
    <form onSubmit={saveCustomer} style={{ padding: "20px" }}>
      <h2>Customer Registration</h2>

      <input name="companyName" placeholder="Company Name" onChange={handleChange} /><br /><br />
      <input name="address" placeholder="Address" onChange={handleChange} /><br /><br />
      <input name="contactPerson" placeholder="Contact Person" onChange={handleChange} /><br /><br />
      <input name="contactNumber" placeholder="Contact Number" onChange={handleChange} /><br /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
      <input name="serviceType" placeholder="Service Type" onChange={handleChange} /><br /><br />

      <button type="submit">Register</button>
    </form>
  );
}

export default CustomerForm;