const connection = require("../Config/database");
require("dotenv").config();



exports.pro_OrderTable = async () => {
  const connection1 = await connection.getConnection();
    await connection1.query(
        `CREATE TABLE IF NOT EXISTS Pro_Order (
          order_id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT,
          pro_id INT,
          quantity INT NOT NULL CHECK (quantity > 0),
          status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
          delivery_date DATE,
          placed_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Changed to TIMESTAMP for defaulting to current time
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
          FOREIGN KEY (pro_id) REFERENCES Product(pro_id) ON DELETE CASCADE
        )` 
      );
      connection1.end()
  };

  exports.getAllOrders = async (req, res) => {
    const connection1 = await connection.getConnection();
    try {
      
      await this.pro_OrderTable();
      
      const [rows] = await connection1.query('SELECT * FROM Pro_Order');
      connection1.end()
      res.status(200).json(rows);
    } catch (error) {  
      connection1.end()
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };


  exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;
    const connection1 = await connection.getConnection();
    try {
      const [rows] = await connection1.query('SELECT * FROM Pro_Order WHERE order_id = ?', [orderId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      connection1.end()
      res.status(200).json(rows[0]);
    } catch (error) {
      connection1.end()
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };

  exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const connection1 = await connection.getConnection();
    if (!status || !['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
  
    try {
      const [result] = await connection1.query(
        'UPDATE Pro_Order SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
        [status, orderId]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      connection1.end()
      res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
      connection1.end()
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };
  

  exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;
    const connection1 = await connection.getConnection();
    try {
      const [result] = await connection1.query('DELETE FROM Pro_Order WHERE order_id = ?', [orderId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Order not found' });
      }
      connection1.end()
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      connection1.end()
      console.error('Error deleting order:', error);
      res.status(500).json({ message: 'Server error, please try again later.' });
    }
  };
  