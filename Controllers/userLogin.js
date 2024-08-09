const jwt = require("jsonwebtoken");
const connection = require("../Config/database");
const { userTable } = require("./createTables");
const bcrypt = require("bcrypt");

exports.userSignUpHandler = async (req, res) => {
  try {
    const connection1 = await connection.getConnection();

    const { email, password, phone, fname, lname } = req.body;
    if (!email || !password || !phone || !fname || !lname) {
      return res.status(400).json({
        success: false,
        message: "All fields are Required",
      });
    }

    var [rows] = await connection1.execute(
      `SELECT * FROM User where email = '${email}'`
    );
    JSON.stringify(rows, null, 2);
    

    if (rows.length>0) {
      return res.status(400).json({
        success: false,
        message: "User Alredy Exist",
      });
    }

    const encripted = await bcrypt.hash(password, 10);
    try {
      await connection1.execute(
        `insert into  User(fname,lname,email,password,phone) values('${fname}','${lname}','${email}','${encripted}','${phone}')`
      );
      return res.status(200).json({
        success: true,
        message: "Sign up succesfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Something went Wrong in User sign up",
    });
  }
};

exports.userLoginHandler = async (req, res) => {
  try {
    const connection1 = await connection.getConnection();
    const { email, password } = req.body;
    if (!email || !password) {
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
      return res.status(400).json({
        success: false,
        message: "User not found",
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
      email: email,
      expireIn: Date.now() + 60 * 60 * 100,
    };
    const token = await jwt.sign(payload, process.env.JWT_SCRETE);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Error while generating a token",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sign in succesfully",
      token: token,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Something went Wrong in User Login",
    });
  }
};
