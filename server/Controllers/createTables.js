const connection = require("../Config/database");


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

const createOffersTable = async () => {
  const connection1 = await connection.getConnection();
  await connection1.execute(
    `CREATE TABLE IF NOT EXISTS Offers (
      offer_id INT PRIMARY KEY AUTO_INCREMENT,  
      image_url VARCHAR(255) NOT NULL,          
      description TEXT NOT NULL,               
      start_date DATE NOT NULL,                
      end_date DATE NOT NULL,                   
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  
    )`
  );
  console.log('Offers table created or already exists.');
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


module.exports = { 
  addressTable,
  operationTable,
  reviewTable
};
