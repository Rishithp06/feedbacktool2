const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Proxy Routes for Microservices
app.use("/auth", createProxyMiddleware({ target: "http://localhost:5001", changeOrigin: true }));
app.use("/users", createProxyMiddleware({ target: "http://localhost:5002", changeOrigin: true }));
app.use("/feedback", createProxyMiddleware({ target: "http://localhost:5003", changeOrigin: true }));
app.use("/admin", createProxyMiddleware({ target: "http://localhost:5004", changeOrigin: true }));

app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
