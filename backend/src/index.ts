import express from "express";

import path from "path";
import crypto from "crypto";
import cors from "cors";
import QRCode from "qrcode";
import { qrCodes } from "./mockData/QRCodes";
import { ENDPOINTS } from "@globalShared/api/endpoints";

import { IQRPort } from "@globalShared/types/entities/QRport.entity";
import { IProduct } from "@globalShared/types/entities/Product.entity";

import { getCryptoKeys } from "@utils/crypto/getCryptoKeys";
import { PRODUCTS } from "@mockData/PRODUCTS";
import { currentQRportSessions } from "@mockData/currentSessions";
import { ApiError } from "@utils/basicApiFncs/ApiError";
import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { IOrder } from "@globalShared/types/entities/Order.entity";
import { sessionController } from "@features/session/sessionExport";
import { qrPortController } from "@features/qrports/qrportExport";
import { orderController } from "@features/orders/orderExport";

const PORT = 3000;
const serverId = "serverName" + "_" + crypto.randomUUID();

const app = express();

// // create session for each QR-code
// qrCodes.forEach((item) => {
//   const newSession: IQRPort = {
//     id: crypto.randomUUID(),
//     role: "guest",
//     status: "open",
//     users: [],
//     messages: [],
//     createdAt: Date.now() + "",
//   };
//   currentQRportSessions.push(newSession);
// });

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

// GET - all catalog
app.get(
  ENDPOINTS.catalog.getAll,
  createEndpoint<void, IProduct[]>(async () => {
    if (!PRODUCTS.length) {
      throw new ApiError(404, "Products not found");
    }
    return PRODUCTS;
  }),
);

// app.patch(
//   ENDPOINTS.orders.decline,
//   createEndpoint<{ id: string }, IOrder>(async (req, authData) => {
//     const { id } = req.body;
//     const { clientUniqId, nonce } = authData;
//     const session = currentQportSessions.find((i) => i.id === sessionId);
//     const order = session?.orders.find((item) => item.id === +id);

//     if (order) {
//       order.status = "cancelled";
//       order.cancelled = {
//         by: clientId || "",
//         at: Date.now() + "",
//       };
//       return order;
//     } else {
//       throw new ApiError(404, "Order not found");
//     }
//   }),
// );

// post - get all orders by qrCodeId
app.post(ENDPOINTS.orders.getAll, orderController.getAll);

app.post(ENDPOINTS.orders.create, orderController.create);

// GET - получить все существующие QR-codes
app.get(ENDPOINTS.qrPorts.getAll, qrPortController.getAll);

// POST создать QR-code
app.post(ENDPOINTS.qrPorts.create, qrPortController.create);

// DELETE - удалить QR-code
app.delete(ENDPOINTS.qrPorts.deleteServer, qrPortController.delete);

app.post(ENDPOINTS.sessions.start, sessionController.join);

app.get(ENDPOINTS.sessions.getAllActive, sessionController.getAllActive);

app.post(ENDPOINTS.sessions.close, sessionController.close);

// get public key + serverId for client
app.get(ENDPOINTS.defaultData, (req, res) => {
  const publicKey = getCryptoKeys.public;
  res.json({ publicKey, serverId });
});

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
