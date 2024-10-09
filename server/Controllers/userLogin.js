const jwt = require("jsonwebtoken");
const connection = require("../Config/database");
const {addressTable } = require("./createTables");
const bcrypt = require("bcrypt");
const { userTable } = require("./adminUser");

exports.userSignUpHandler = async (req, res) => {
  const connection1 = await connection.getConnection();
  try {
    
    
    const { email, password, fname, lname ,phone} = req.body; // Added 'phone' to the destructured object
   
   
    if (!email || !password || !fname || !lname ) {
      connection1.end();
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    userTable();
    // Check if user already exists
    
    const [rows] = await connection1.execute(
      `SELECT * FROM User WHERE email = ?`, [email]
    );
    console.log(rows)
    if (rows.length > 0) {
      connection1.end();
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user
    await connection1.execute(
      `INSERT INTO User (fname, lname, email, password,phone) VALUES (?, ?, ?, ?, ?)`, 
      [fname, lname, email, encryptedPassword, phone]
    );
    connection1.end()
    return res.status(200).json({
      success: true, 
      message: "Sign up successfully",
    });
    
  } catch (e) {
    connection1.end()
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during user sign up",
    });
  }
};


exports.userLoginHandler = async (req, res) => {
  const connection1 = await connection.getConnection();
  try {
    
    const { email, password } = req.body;
    if (!email || !password) {
      connection1.end();
      return res.status(400).json({
        success: false,
        message: "All fields are Required",
      });
    }
    var data;

    var [rows] = await connection1.execute(
      `SELECT * FROM User where email = '${email}'`
    );
    JSON.stringify(rows, null, 2);
    data = rows[0].password;
    if (!data) {
      connection1.end();
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const verifyPassword = await bcrypt.compare(password, data);
    if (!verifyPassword) {
      connection1.end();
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const payload = {
      data : rows[0],
      expireIn: Date.now() + 60 * 60 * 100,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET);

    if (!token) {
      connection1.end();
      return res.status(400).json({
        success: false,
        message: "Error while generating a token",
      });
    }
    connection1.end();
    return res.status(200).json({
      success: true,
      message: "Sign in succesfully",
      token: token,
    });
  } catch (e) {
    connection1.end();
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Something went Wrong in User Login",
    });
  }
};
