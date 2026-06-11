import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../App.css";  // ✅ Fixed path

function InvoiceForm() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([{ item: "", quantity: 1, price: 0 }]);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-" + Math.floor(1000 + Math.random() * 9000));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5162/api/customer/all")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);
    if (customerId) {
      const customer = customers.find(c => c.customerId === parseInt(customerId));
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer(null);
    }
  };

  const addItem = () => {
    setItems([...items, { item: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.setTextColor(102, 126, 234);
    doc.text("INVOICE", 105, 25, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Big Prime", 105, 35, { align: "center" });
    doc.text("Navavoor Privu, Vadavalli, Coimbatore.", 105, 42, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice #: ${invoiceNumber}`, 20, 60);
    doc.text(`Date: ${date}`, 170, 60, { align: "right" });

    if (selectedCustomer) {
      doc.setDrawColor(200, 200, 200);
      doc.rect(20, 70, 170, 30);
      doc.setFontSize(12);
      doc.setTextColor(102, 126, 234);
      doc.text("Bill To:", 25, 80);
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(selectedCustomer.companyName, 25, 90);
      doc.text(`Contact: ${selectedCustomer.contactPerson}`, 25, 100);
      doc.text(`Address: ${selectedCustomer.address}`, 100, 100);
      doc.text(`Phone: ${selectedCustomer.contactNumber}`, 100, 90);
    }

    const tableData = items.map(item => [
      item.item,
      item.quantity.toString(),
      `Rs.${item.price}`,
      `Rs.${item.quantity * item.price}`
    ]);

    autoTable(doc, {
      startY: 115,
      head: [["Item Description", "Qty", "Unit Price", "Total"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [102, 126, 234], textColor: 255 }
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(102, 126, 234);
    doc.text(`TOTAL: Rs.${calculateTotal()}`, 170, finalY, { align: "right" });
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    doc.save(`${invoiceNumber}.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert("Please select a customer!");
      return;
    }
    generatePDF();
  };

  return (
    <div className="container">
      <h1>Create Invoice</h1>
      <h2>Generate New Invoice</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Invoice Number</label>
          <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Select Customer</label>
          <select value={selectedCustomerId} onChange={handleCustomerChange} required style={{ width: "100%", padding: "12px 15px", border: "2px solid #e0e0e0", borderRadius: "8px", fontSize: "16px" }}>
            <option value="">-- Select Customer --</option>
            {customers.map((c) => (
              <option key={c.customerId} value={c.customerId}>{c.companyName}</option>
            ))}
          </select>
        </div>

        {selectedCustomer && (
          <div className="form-group">
            <label>Customer Details</label>
            <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
              <p><strong>Company:</strong> {selectedCustomer.companyName}</p>
              <p><strong>Contact:</strong> {selectedCustomer.contactPerson}</p>
              <p><strong>Phone:</strong> {selectedCustomer.contactNumber}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
              <p><strong>Address:</strong> {selectedCustomer.address}</p>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Product Details</label>
          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input placeholder="Item name" value={item.item} onChange={(e) => handleItemChange(index, "item", e.target.value)} style={{ flex: 2 }} required />
              <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)} style={{ flex: 1 }} min="1" />
              <input type="number" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)} style={{ flex: 1 }} />
              {items.length > 1 && <button type="button" onClick={() => removeItem(index)} style={{ background: "#dc3545", padding: "8px 15px", width: "auto" }}>X</button>}
            </div>
          ))}
          <button type="button" onClick={addItem} style={{ background: "#6c757d", marginTop: "10px", padding: "10px 20px" }}>+ Add Item</button>
        </div>

        <div style={{ textAlign: "right", fontSize: "20px", fontWeight: "bold", margin: "20px 0", color: "#667eea" }}>
          Total: Rs.{calculateTotal()}
        </div>

        <button type="submit">Generate & Download PDF</button>
        <button type="button" className="back-btn" onClick={() => navigate("/home")}>Back to Home</button>
      </form>
    </div>
  );
}

export default InvoiceForm;