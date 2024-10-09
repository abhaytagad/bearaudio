
const connection = require("../Config/database");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();


  

exports.productTable = async () => {
  const connection1 = await connection.getConnection();
    await connection1.execute(
      `CREATE TABLE IF NOT EXISTS Product (
        pro_id INT PRIMARY KEY AUTO_INCREMENT,  
        category_id INT,                              
        brand VARCHAR(200),                           
        name VARCHAR(500) NOT NULL,             
        description TEXT,                       
        price DECIMAL(10, 2) NOT NULL,          
        discount_price DECIMAL(10, 2),          
        colors VARCHAR(255),                    
        images JSON,                       
        stock INT DEFAULT 0,                    
        status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',  
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
        FOREIGN KEY (category_id) REFERENCES Category(cat_id) ON DELETE CASCADE
      )`
    );
    connection1.end(); 
  };

exports.addProduct = async (req, res) => {
  const connection1 = await connection.getConnection();
    try {
      
      await this.productTable()
      const { cat_id, brand_id, name, description, price, discount_price, colors, images, stock, status } = req.body;
      if (!cat_id || !brand_id || !name || !price) {
        connection1.end();
        return res.status(400).json({
          success: false,
          message: "Category, brand, name, and price are required fields.",
        });
      }
      const query = `
        INSERT INTO Product 
        (cat_id, brand_id, name, description, price, discount_price, colors, images, stock, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      
      await connection1.execute(query, [
        cat_id,
        brand_id,
        name,
        description || null,     
        price,
        discount_price || null,   
        colors || null,           
        images || null,           
        stock || 0,              
        status || 'active'        
      ]);
  
      connection1.end();
      return res.status(201).json({
        success: true,
        message: "Product added successfully!",
      });
  
    } catch (error) {
      connection1.end();
      console.error("Error adding product:", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong while adding the product.",
      });
    }
  };
  

  exports.adminDashboard = async (req, res) => {
    const connection1 = await connection.getConnection();
    try {
  
      const [productCount] = await connection1.execute('SELECT COUNT(*) AS totalProducts FROM Product');
      const [orderCount] = await connection1.execute('SELECT COUNT(*) AS totalOrders FROM Pro_Order');
      const [userCount] = await connection1.execute('SELECT COUNT(*) AS totalUsers FROM User');
      connection1.end();
      return res.status(200).json({
        success: true,
        data: {
          totalProducts: productCount[0].totalProducts,
          totalOrders: orderCount[0].totalOrders,
          totalUsers: userCount[0].totalUsers,
        }
      });
  
    } catch (err) {
      connection1.end();
      console.error('Error fetching admin dashboard metrics:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  
  exports.getAllProducts = async (req, res) => {
    const connection1 = await connection.getConnection();

    try {
      await this.productTable()
      const [products] = await connection1.execute('SELECT * FROM Product');
      connection1.end();
      console.log(products)
      return res.status(200).json({
        success: true,
        products
      }); 
      
    } catch (error) {
      connection1.end();
      console.error('Error fetching products:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });  
    }
  };

  const uploadImagesToCloudinary = async (images) => {
    try {
      if (images.name == undefined){
        const uploadedImages = await Promise.all(
          images.map( async(image) =>
            
            { 
              const response = await cloudinary.uploader.upload(image.tempFilePath)
              return response
            }
              
          )
        );
        return uploadedImages.map((image) => image.secure_url);
      }
      else{
        const response = await cloudinary.uploader.upload(images.tempFilePath);
        return [response.secure_url];
      }
      
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      throw new Error('Image upload failed');
    }
  };

  exports.addProduct = async (req, res) => {
    const connection1 = await connection.getConnection();
    try {
       await this.productTable()
      const { name, brand, price, category, colors, description } = req.body;
        const images = req.files.images
        console.log(req)
      if (!name || !price || !category) {
        connection1.end();
        return res.status(400).json({
          success: false,
          message: 'Product name, price, and category are required',
        });
      }
      
      const imageUrls = await uploadImagesToCloudinary(images);
  
      const [result] = await connection1.execute(
        `INSERT INTO Product (name, brand, price, category_id, colors, images, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, brand, price, category, colors, JSON.stringify(imageUrls), description]
      );
      connection1.end();
      return res.status(201).json({
        success: true,
        message: 'Product added successfully',
        product_id: result,
      });
    } catch (error) {
      connection1.end();
      console.error('Error adding product:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  };


  exports.editProduct = async (req, res) => {
    const { productId } = req.params;
    const connection1 = await connection.getConnection();
    const { name, brand, price, category, colors, description } = req.body;
    try {
    
      const [rows] = await connection1.execute('SELECT * FROM product WHERE pro_id = ?', [productId]);
      if (rows.length === 0) {
        connection1.end();
        return res.status(404).json({ message: 'Product not found' });
      }
      let product = rows[0];
      await connection1.execute(
        'UPDATE product SET name = ?, brand = ?, price = ?, category_id = ?, colors = ?, description = ? WHERE pro_id = ?',
        [
          name || product.name,
          brand || product.brand,
          price || product.price,
          category || product.category_id,
          colors || product.colors,
          description || product.description,
          productId,
        ]   
      );
      if ( req.files || req.files.images.length > 0 ) {
        if (product.images && product.images.length > 0) {
          const existingImages = product.images; 
          for (const image of existingImages) {
            await cloudinary.uploader.destroy(image);
          }
        }
        const imageUploads =  await uploadImagesToCloudinary(req.files.images)
        console.log(imageUploads)
        await connection1.execute('UPDATE product SET images = ? WHERE pro_id = ?', [
          JSON.stringify(imageUploads),
          productId,
        ]);
      }
      connection1.end();
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      connection1.end();
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };



  exports.getProductById = async (req, res) => {
    const { productId } = req.params;
    console.log(req)
    const connection1 = await connection.getConnection();
    try {
      const [rows] = await connection1.execute('SELECT * FROM Product WHERE pro_id = ?', [productId]);
  
      if (rows.length === 0) {
        connection1.end();
        return res.status(404).json({ message: 'Product not found' });
      }
      connection1.end();
      res.status(200).json(rows[0]);
    } catch (error) {
      connection1.end();
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };

  exports.deleteById = async (req, res) => {
    const { productId } = req.params;
    const connection1 = await connection.getConnection();
    try {
      const [rows] = await connection1.execute('SELECT * FROM Product WHERE pro_id = ?', [productId]);
      if (rows.length === 0) {
        connection1.end();
        return res.status(404).json({ message: 'Product not found' });
      }
      await connection1.execute('DELETE FROM Product WHERE pro_id = ?', [productId]);
      connection1.end();
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      connection1.end();
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  }; 
    