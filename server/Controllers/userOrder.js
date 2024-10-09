
const connection = require('../Config/database')

exports.allOrders = async (req, res) => {
    const userId = req.user.data.user_id; // Assuming user is authenticated and ID is available
  
    // Get a connection from the connection pool
    const connection1 = await connection.getConnection();
    try {
      // Fetch the orders for the user
      const [orders] = await connection1.execute(
        'SELECT * FROM Pro_Order WHERE user_id = ?',
        [userId]
      );
  
      // Fetch the associated products for each order
      const products = await Promise.all(
        orders.map(async (order) => {
          const [product] = await connection1.execute(
            'SELECT * FROM Product WHERE pro_id = ?',
            [order.pro_id]
          );
          return product[0]; // Assuming product[0] contains the product details
        })
      );
      console.log(products)
      // Close the connection after all queries are done
      connection1.end();
  
      // Return both orders and products in the response
      res.status(200).json({ orders, products });
    } catch (error) {
      connection1.end();
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  };
  

exports.placeOrder = async (req, res) => {
    const userId = req.user.data.user_id; // Assuming user is authenticated and ID is available
    console.log(req.body.cartItems)
    const { cartItems, totalAmount } = req.body;
    const connection1 = await connection.getConnection();
    try {
        
        for (const product of cartItems) {
            await connection1.execute(
                'INSERT INTO Pro_Order (user_id, pro_id, quantity) VALUES (?, ?, ?)',
                [userId, product.pro_id, 1]
            );
        }
        connection1.end()
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        connection1.end()
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order' });
    }
}