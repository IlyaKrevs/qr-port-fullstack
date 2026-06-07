import express from "express";

import path from "path";
import cors from "cors";
import crypto from "crypto";
import { getCryptoKeys } from "@utils/crypto/getCryptoKeys";

import { ENDPOINTS } from "@globalShared/api/endpoints";
import { catalogController } from "@features/catalog/catalogExport";
import { orderController } from "@features/orders/orderExport";
import { qrPortController } from "@features/qrports/qrportExport";
import { sessionController } from "@features/session/sessionExport";

const PORT = 3000;
const serverId = "serverName" + "_" + crypto.randomUUID();

const app = express();

const allowedIps = [
  "http://localhost:5173",
  "http://localhost:3000",
  "127.0.0.1",
];

app.use(express.json());
app.use(
  cors({
    origin: allowedIps,
    credentials: true,
  }),
);

// catalog
app.get(ENDPOINTS.catalog.getAll, catalogController.getAll());

// orders
app.post(ENDPOINTS.orders.getAll, orderController.getAll());
app.post(ENDPOINTS.orders.create, orderController.create());

// qrports
app.get(ENDPOINTS.qrPorts.getAll, qrPortController.getAll());
app.post(ENDPOINTS.qrPorts.create, qrPortController.create());
app.delete(ENDPOINTS.qrPorts.deleteServer, qrPortController.delete());

// sessions
app.post(ENDPOINTS.sessions.start, sessionController.join());
app.get(ENDPOINTS.sessions.getAllActive, sessionController.getAllActive());
app.post(ENDPOINTS.sessions.close, sessionController.close());

// get public key + serverId for client
app.get(ENDPOINTS.defaultData, (req, res) => {
  const publicKey = getCryptoKeys.public;
  res.json({ publicKey, serverId });
});

// basic
app.use(express.static(path.join(__dirname, "../public/")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║     🚀 Q-port Server запущен           ║
  ╠════════════════════════════════════════╣
  ║  Порт: ${PORT}                            ║
  ║  Админка: http://localhost:${PORT}/admin  ║
  ║  Клиент: http://localhost:${PORT}/client  ║
  ╚════════════════════════════════════════╝
  `);
});
