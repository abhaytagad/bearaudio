
const connection = require('../Config/database.js');

exports.cartTable = async () => {
    const connection1 = await connection.getConnection();
    await connection1.execute(`
      CREATE TABLE IF NOT EXISTS Cart (
        pro_id INT,
        user_id INT,
        PRIMARY KEY (pro_id, user_id),
        FOREIGN KEY (pro_id) REFERENCES Product(pro_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
      )
    `);
    connection1.end();
  };

exports.getCart = async (req, res) => {
  const connection1 = await connection.getConnection();
  try {
    await this.cartTable();
    
    const user_id = req.user.data.user_id; 
    const [cartItems] = await connection1.execute(
      'SELECT p.pro_id,p.name, p.price ,p.images, p.discount_price FROM Cart c JOIN Product p ON c.pro_id = p.pro_id WHERE c.user_id = ?',
      [user_id]
    );
    connection1.end();
    res.json({ cartItems });

  } catch (error) {
    connection1.end();
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.addCart =  async (req, res) => {
 
  await this.cartTable(); 
  const { productId } = req.body;
  const user_id = req.user.data.user_id;
  const connection1 = await connection.getConnection();
  try {
    await connection1.execute(
      'INSERT INTO Cart (pro_id, user_id) VALUES (?, ?)',
      [productId, user_id]
    );
    connection1.end();
    res.status(200).send('Item added to cart');
  } catch (error) {
    connection1.end();
    console.error(error);
    res.status(500).send('Server Error');
  }
};


exports.deleteCart = async (req, res) => {
  const { pro_id } = req.params;
  const user_id = req.user.data.user_id; 
  const connection1 = await connection.getConnection();
  try {
    await connection1.execute(
      'DELETE FROM Cart WHERE pro_id = ? AND user_id = ?',
      [pro_id, user_id]
    );
    connection1.end();
    res.status(200).send('Item removed from cart');
  } catch (error) {
    connection1.end();
    console.error(error);
    res.status(500).send('Server Error');
  }
};

