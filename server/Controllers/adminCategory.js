const connection = require("../Config/database");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();



exports.categoryTable = async () => {
  const connection1 = await connection.getConnection();
  await connection1.execute(
      `CREATE TABLE IF NOT EXISTS Category (
        cat_id INT PRIMARY KEY AUTO_INCREMENT,  
        name VARCHAR(100) NOT NULL,             
        description TEXT,                       
        image_url TEXT,                 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`
    );
    connection1.end()        
};

exports.getAllCategory = async (req,res)=>{
  const connection1 = await connection.getConnection();
  try{
    console.log("in get all category");
      await this.categoryTable();
      const [categories] = await connection1.query('SELECT * FROM Category');
      connection1.end()
      return res.status(200).json({
          success: true,
          categories
      });   
  }
  catch(err){
    connection1.end()
      console.error('Error fetching categories:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
  }
}


exports.addCategory = async (req, res) => {
  const connection1 = await connection.getConnection();
    try {
      
      await this.categoryTable();
      const { name, description } = req.body;
      if (!name || !description) {
        return res.status(400).json({ success: false, message: "Name and description are required" });
      }
      const imageUploads =  await cloudinary.uploader.upload(req.files.image.tempFilePath)
      const image_url = imageUploads.secure_url;
      


      await connection1.execute(
        `INSERT INTO Category (name, description, image_url) VALUES (?, ?, ?)`,
        [name, description, image_url]
      );
      connection1.end();
      return res.status(201).json({
        success: true,
        message: "Category added successfully",
      });
    } catch (error) {
      connection1.end();
      console.error('Error adding category:', error);
      return res.status(500).json({
        success: false,
        message: "Server error, please try again later",
      });
    }
  };
  