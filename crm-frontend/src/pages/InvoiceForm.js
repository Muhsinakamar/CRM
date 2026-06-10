import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../App.css";

function InvoiceForm() {
  const [invoice, setInvoice] = useState({
    customerName: "",
    amount: "",
    description: "",
    invoiceNumber: "",
    date: new Date().toISOString().split('T')[0]
  });

  const navigate = useNavigate();

  // Auto-fill customer name from latest customer
  useEffect(() => {
    axios.get("http://localhost:5162/api/customer/latest")
      .then(res => {
        if (res.data) {
          // Generate random invoice number
          const invNum = "INV-" + Math.floor(1000 + Math.random() * 9000);
          setInvoice(prev => ({
            ...prev,
            customerName: res.data.companyName,
            invoiceNumber: invNum
          }));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(102, 126, 234);
    doc.text("INVOICE", 105, 20, { align: "center" });

    // Invoice Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${invoice.date}`, 20, 50);
    doc.text(`Customer Name: ${invoice.customerName}`, 20, 60);

    // Line
    doc.setDrawColor(102, 126, 234);
    doc.line(20, 70, 190, 70);

    // Table - use autoTable correctly
    autoTable(doc, {
      startY: 80,
      head: [["Description", "Amount"]],
      body: [
        [invoice.description, `$${invoice.amount}`]
      ],
      theme: "striped",
      headStyles: {
        fillColor: [102, 126, 234]
      }
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Amount: $${invoice.amount}`, 150, finalY, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });

    // Download PDF
    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  return (
    <div className="container">
      <h1>Create Invoice</h1>
      <h2>Generate New Invoice</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Invoice Number</label>
          <input
            name="invoiceNumber"
            value={invoice.invoiceNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            name="date"
            type="date"
            value={invoice.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Customer Name</label>
          <input
            name="customerName"
            value={invoice.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount ($)</label>
          <input
            name="amount"
            type="number"
            placeholder="Enter amount"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            name="description"
            placeholder="Enter description"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Generate & Download PDF</button>
        
        <button 
          type="button" 
          className="back-btn"
          onClick={() => navigate("/home")}
        >
          Back to Home
        </button>
      </form>
    </div>
  );
}

export default InvoiceForm;