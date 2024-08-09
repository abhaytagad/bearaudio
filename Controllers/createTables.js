const connection = require("../Config/database");

const userTable = async() => {
  const connection1 = await connection.getConnection();
  await connection1.execute(`
    CREATE TABLE User (
        user_id INT PRIMARY KEY  AUTO_INCREMENT,
        lname VARCHAR(50),
        fname VARCHAR(50),
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(15),
        add_id INT,
        password VARCHAR(200)
    );
`);
};

const productTable = async() => {
  const connection1 = await connection.getConnection();
  await connection1.execute(
    `CREATE TABLE Product (
    pro_id INT PRIMARY KEY,
    cat_name VARCHAR(50),
    brand VARCHAR(50),
    price DECIMAL(10, 2),
    colors VARCHAR(50),
    images VARCHAR(255)
)`
  );
};

const addressTable = async() => {
  const connection1 = await connection.getConnection();
  await connection1.query(
    `CREATE TABLE Address (
    add_id INT PRIMARY KEY,
    pin_code VARCHAR(10),
    street VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50)
)`
  );
};

const paymentTable = async() => {
  const connection1 = await connection.getConnection();
  await connection1.query(
    `CREATE TABLE Payments (
    pay_id INT PRIMARY KEY,
    user_id INT,
    tran_details TEXT,
    date DATE,
    pro_id INT
)`
  );
};

const pro_OrderTable = async() => {
  const connection1 = await connection.getConnection();
  await connection1.query(
    `CREATE TABLE Pro_Order (
    order_id INT PRIMARY KEY,
    user_id INT,
    pro_id INT,
    quantity INT,
    status VARCHAR(20),
    delivery_date DATE,
    placeon DATE
)`
  );
};

const adminTable = async() => {
  const connection1 = await connection.getConnection();
  await connection1.query(
    `CREATE TABLE Admin (
    addmin_id INT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(50)
)`
  );
};

const operationTable = async() => {
  const connection1 = await connection.getConnection();
  await connection1.query(
    `CREATE TABLE Operation (
    ope_id INT PRIMARY KEY,
    addmin_id INT,
    pro_id INT,
    description TEXT,
    date DATE
)`
  );
};

const reviewTable = async() => {
  const connection1 = await connection.getConnection();
  await connection1.query(
    `CREATE TABLE Review (
    user_id INT,
    pro_id INT,
    rating INT,
    description TEXT,
    PRIMARY KEY (user_id, pro_id)
)`
  );
};

const cartTable = () => {
  connection.query(
    `CREATE TABLE Cart (
    pro_id INT,
    user_id INT,
    discount DECIMAL(5, 2),
    PRIMARY KEY (pro_id, user_id)
)`,
    (err, result) => {
      if (err){
        console.log(err);
      }
      else{
        console.log("Table created Cart");
      }
    }
  );
};

module.exports = {
  userTable,
  productTable,
  addressTable,
  paymentTable,
  pro_OrderTable,
  adminTable,
  operationTable,
  reviewTable,
  cartTable,
};
