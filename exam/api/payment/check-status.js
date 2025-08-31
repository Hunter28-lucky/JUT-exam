export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Call ZapUPI API to check order status
    const zapupiResponse = await fetch("https://api.zapupi.com/api/order-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token_key: process.env.ZAPUPI_TOKEN_KEY,
        secret_key: process.env.ZAPUPI_SECRET_KEY,
        order_id: order_id,
      }),
    });

    const zapupiData = await zapupiResponse.json();
    
    if (zapupiData.status === "success" && zapupiData.data) {
      res.json({
        success: true,
        status: zapupiData.data.status,
        data: zapupiData.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: zapupiData.message || "Order not found",
      });
    }
  } catch (error) {
    console.error("Payment status check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check payment status",
    });
  }
}