CREATE DATABASE not_amazon_db;

USE not_amazon_db;

CREATE TABLE products
(
    id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR (100) NOT NULL,
    department_name VARCHAR (100) NOT NULL,
    department_id INT (4) NOT NULL, 
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER(20) NOT NULL, 
    PRIMARY KEY(id)
);


INSERT INTO products (product_name, department_name, department_id, price, stock_quantity)
VALUES ("Couture Dress", "Fashion", 1, 305.49, 14),
        ("Vintage Heels", "Fashion", 1, 400.05, 3),
        ("Brown Leather Handbag", "Fashion", 1, 498.00, 6),
        ("CrockPot", "Kitchen", 2, 100.05, 12),
        ("George Foreman Grill", "Kitchen", 2, 250.04, 10),
        ("Spatula", "Kitchen", 2, 5.95, 20),
        ("SouthWest Style Rug", "Home", 3, 245.10, 12),
        ("Small Marble Coffee Table", "Home", 3, 500.95, 5),
        ("Tempurpedic Mattress-Queen", "Home", 3, 4500.99, 3);