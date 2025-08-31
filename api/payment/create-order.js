export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, order_id, package_name, semester, branch } = req.body;

    if (!amount || !order_id || !package_name || !semester || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    // Call ZapUPI API to create order
    const zapupiResponse = await fetch("https://api.zapupi.com/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token_key: process.env.ZAPUPI_TOKEN_KEY,
        secret_key: process.env.ZAPUPI_SECRET_KEY,
        amount: amount.toString(),
        order_id: order_id,
      }),
    });

    const zapupiData = await zapupiResponse.json();
    
    if (zapupiData.status === "success") {
      res.json({
        success: true,
        payment_url: zapupiData.payment_url,
        order_id: zapupiData.order_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: zapupiData.message,
      });
    }
  } catch (error) {
    console.error("Payment order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
    });
  }
}