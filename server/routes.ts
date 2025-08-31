import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  createPaymentOrderSchema, 
  checkPaymentStatusSchema,
  type ZapUPIOrderResponse,
  type ZapUPIStatusResponse 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Payment routes
  app.post("/api/payment/create-order", async (req, res) => {
    try {
      const orderData = createPaymentOrderSchema.parse(req.body);
      
      // Call ZapUPI API to create order
      const zapupiResponse = await fetch("https://api.zapupi.com/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          token_key: process.env.ZAPUPI_TOKEN_KEY!,
          secret_key: process.env.ZAPUPI_SECRET_KEY!,
          amount: orderData.amount.toString(),
          order_id: orderData.order_id,
        }),
      });

      const zapupiData: ZapUPIOrderResponse = await zapupiResponse.json();
      
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
  });

  app.post("/api/payment/check-status", async (req, res) => {
    try {
      const statusData = checkPaymentStatusSchema.parse(req.body);
      
      // Call ZapUPI API to check order status
      const zapupiResponse = await fetch("https://api.zapupi.com/api/order-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          token_key: process.env.ZAPUPI_TOKEN_KEY!,
          secret_key: process.env.ZAPUPI_SECRET_KEY!,
          order_id: statusData.order_id,
        }),
      });

      const zapupiData: ZapUPIStatusResponse = await zapupiResponse.json();
      
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
  });

  const httpServer = createServer(app);
  return httpServer;
}
