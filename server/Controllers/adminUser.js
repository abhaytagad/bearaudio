const connection = require("../Config/database");
require("dotenv").config();



exports.userTable = async () => {
  const connection1 = await connection.getConnection();
    await connection1.execute(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INT PRIMARY KEY AUTO_INCREMENT,
        lname VARCHAR(50) NOT NULL,
        fname VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15) CHECK (phone REGEXP '^[0-9]{10,15}$'),
        add_id INT,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (add_id) REFERENCES Address(add_id) ON DELETE SET NULL
      );
    `);
  };
exports.getUsers = async (req, res) => {
  const connection1 = await connection.getConnection();
    try {
      
      await this.userTable();
      const [rows] = await connection1.query('SELECT * FROM User');
      connection1.end()
      res.status(200).json(rows);
    } catch (error) {
      connection1.end()
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };
  
  exports.getUsersById = async (req, res) => {
    const connection1 = await connection.getConnection();
    try {
      
      const user_id  = req.user.data.user_id;
      
      const [rows] = await connection1.query('SELECT * FROM User where user_id = ?',[user_id]);
      connection1.end() 
      res.status(200).json(rows);
    } catch (error) {
      connection1.end()
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };
  

  exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;
    const connection1 = await connection.getConnection();
    try {
      await connection1.query('UPDATE User SET role = ? WHERE user_id = ?', [role, userId]);
      connection1.end();
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      connection1.end();
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };
  
 
  exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    const connection1 = await connection.getConnection();
    try {
      
      await this.userTable();
      await connection1.query('DELETE FROM User WHERE user_id = ?', [userId]);
      connection1.end();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      connection1.end();
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };