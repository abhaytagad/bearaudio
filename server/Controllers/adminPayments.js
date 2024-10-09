const connection = require("../Config/database");
require("dotenv").config();

exports.paymentTable = async () => {
  const connection1 = await connection.getConnection();
  await connection1.query(
    `CREATE TABLE IF NOT EXISTS Payments (
      pay_id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      tran_details TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP, 
      pro_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
      FOREIGN KEY (pro_id) REFERENCES Product(pro_id) ON DELETE CASCADE
    )`
  );
  };


exports.getPayments = async (req, res) => {
  const connection1 = await connection.getConnection();
  try {
    await this.paymentTable();
    
    await this.paymentTable();
    const [payments] = await connection1.query(`SELECT * FROM Payments`);
    connection1.end()
    res.status(200).json(payments);
  } catch (error) {
    connection1.end()
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error, unable to fetch payments' });
  }
};
  
 
  exports.deletePayment = async (req, res) => {
    const { paymentId } = req.params;
    const connection1 = await connection.getConnection();
    try {
     
      const [payment] = await connection1.query(`SELECT * FROM Payments WHERE pay_id = ?`, [paymentId]);
      if (payment.length === 0) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      await connection.query(`DELETE FROM Payments WHERE pay_id = ?`, [paymentId]);
      connection1.end()
      res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
      connection1.end()
      console.error('Error deleting payment:', error);
      res.status(500).json({ message: 'Server error, unable to delete payment' });
    }
  };