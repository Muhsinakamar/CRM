CREATE TABLE customers
(
    customer_id SERIAL PRIMARY KEY,
    company_name VARCHAR(200),
    address TEXT,
    contact_person VARCHAR(100),
    contact_number VARCHAR(20),
    email VARCHAR(150),
    service_type VARCHAR(100),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM customers;

DELETE FROM customers;