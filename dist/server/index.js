// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var createPaymentOrderSchema = z.object({
  amount: z.number().positive(),
  order_id: z.string().min(1),
  package_name: z.string(),
  semester: z.string(),
  branch: z.string()
});
var checkPaymentStatusSchema = z.object({
  order_id: z.string().min(1)
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/payment/create-order", async (req, res) => {
    try {
      const orderData = createPaymentOrderSchema.parse(req.body);
      const zapupiResponse = await fetch("https://api.zapupi.com/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          token_key: process.env.ZAPUPI_TOKEN_KEY,
          secret_key: process.env.ZAPUPI_SECRET_KEY,
          amount: orderData.amount.toString(),
          order_id: orderData.order_id
        })
      });
      const zapupiData = await zapupiResponse.json();
      if (zapupiData.status === "success") {
        res.json({
          success: true,
          payment_url: zapupiData.payment_url,
          order_id: zapupiData.order_id
        });
      } else {
        res.status(400).json({
          success: false,
          message: zapupiData.message
        });
      }
    } catch (error) {
      console.error("Payment order creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create payment order"
      });
    }
  });
  app2.post("/api/payment/check-status", async (req, res) => {
    try {
      const statusData = checkPaymentStatusSchema.parse(req.body);
      const zapupiResponse = await fetch("https://api.zapupi.com/api/order-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          token_key: process.env.ZAPUPI_TOKEN_KEY,
          secret_key: process.env.ZAPUPI_SECRET_KEY,
          order_id: statusData.order_id
        })
      });
      const zapupiData = await zapupiResponse.json();
      if (zapupiData.status === "success" && zapupiData.data) {
        res.json({
          success: true,
          status: zapupiData.data.status,
          data: zapupiData.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: zapupiData.message || "Order not found"
        });
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check payment status"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var __dirname = dirname(fileURLToPath(import.meta.url));
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "client/dist"),
    // ✅ match server static path
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
import path3 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    const distPath = path3.resolve(__dirname2, "../client");
    app.use(express2.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path3.join(distPath, "index.html"));
    });
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`\u{1F680} Server running on port ${port}`);
    }
  );
})();
