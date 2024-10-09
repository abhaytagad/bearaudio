const jwt = require("jsonwebtoken");
const connection = require("../Config/database");
const bcrypt = require("bcrypt");
require("dotenv").config();



exports.adminTable = async () => {
  const connection1 = await connection.getConnection();
  await connection1.query(
    `CREATE TABLE IF NOT EXISTS Admin (
      admin_id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(100) NOT NULL UNIQUE,  
      password VARCHAR(255) NOT NULL,      
      name VARCHAR(50) NOT NULL           
    )` 
  );
}

exports.adminSignUpHandler = async (req, res) => {
  const connection1 = await connection.getConnection();
    try {
      
      await this.adminTable();
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({     
          success: false, 
          message: "All fields are required",
        });   
      } 
      const [rows] = await connection1.execute(
        `SELECT * FROM admin WHERE email = ?`, [email]  
      );

  
      if (rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Admin already exists",
        });
      }
      const encryptedPassword = await bcrypt.hash(password, 10);
      const response = await connection1.execute(
        `INSERT INTO Admin(email, password, name) VALUES(?, ?, ?)`, 
        [email, encryptedPassword, name]
      );
  
        
      const token = jwt.sign(
        { email, name, role: 'admin' }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
      );
      connection1.end();
      return res.status(200).json({
        success: true,
        message: "Admin signed up successfully",
        token, 
      });
  
    } catch (e) {
      console.log(e);
      connection1.end();
      return res.status(400).json({
        success: false,
        message: "Something went wrong during admin sign up",
      });
    }
  };



  exports.adminLoginHandler = async (req, res) => {
    try {
       
      const connection1 = await connection.getConnection();
      await this.adminTable()
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are Required",
        });
      }
      var data;
   
      var [rows] = await connection1.execute(
        `SELECT * FROM Admin where email = '${email}'`
      );
      JSON.stringify(rows, null, 2);
      data = rows[0].password;
  
      if (!data) {
        return res.status(400).json({
          success: false,
          message: "Admin not found",
        });
      }
  
      const verifyPassword = await bcrypt.compare(password, data);
      if (!verifyPassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        });
      }
      const payload = {
        data: rows[0],
        expireIn: Date.now() + 60 * 60 * 100,
      };
      const token = await jwt.sign(payload, process.env.JWT_SECRET);
  
      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Error while generating a token",
        });
      }
      connection1.end();
      return res.status(200).json({
        rows,
        success: true,
        message: "Sign in succesfully",
        token: token,
      });
    } catch (e) {
      console.log(e);
      connection1.end();
      return res.status(400).json({
        
        success: false,
        message: "Something went Wrong in Admin Login",
      });
    }
  };
