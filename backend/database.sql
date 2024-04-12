CREATE DATABASE fuelrateweb;

CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
      /* in client_profiles create a foreign key that references users(id)*/ 
CREATE TABLE IF NOT EXISTS client_profiles (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    address1 VARCHAR(100) NOT NULL,
    address2 VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    zipcode VARCHAR(9) NOT NULL
);
CREATE TABLE IF NOT EXISTS fuelquotes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    gallons_requested INT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_date DATE NOT NULL,
    price_per_gallon DECIMAL NOT NULL,
    total_amount_due DECIMAL NOT NULL
);

INSERT INTO users (id, username, password)
VALUES
    (1, 'username', 'password');
    (2, 'usernames', 'passwords');

INSERT INTO fuelquotes (user_id, gallons_requested, delivery_address, delivery_date, price_per_gallon, total_amount_due)
VALUES
    (1, 550, '7404 Marlborough Rd. New Kensington, PA 15068', '2024-05-20', 3.276, 1801.80),
    (1, 350, '7404 Marlborough Rd. New Kensington, PA 15068', '2024-04-22', 3.279, 1147.65),
    (1, 600, '7404 Marlborough Rd. New Kensington, PA 15068', '2024-03-15', 3.225, 1935.00);