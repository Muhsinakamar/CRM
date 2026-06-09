import { useState } from "react";

function InvoiceForm() {

  const [invoice, setInvoice] = useState({
    customerName: "",
    amount: "",
    description: ""
  });

  const handleChange = (e) => {
    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Invoice Created (Next step: save to DB)");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Invoice</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="customerName"
          placeholder="Customer Name"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="amount"
          placeholder="Amount"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Save Invoice</button>
      </form>
    </div>
  );
}

export default InvoiceForm;