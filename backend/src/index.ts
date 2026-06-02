import express from "express";

import path from "path";
import crypto from "crypto";
import cors from "cors";
import QRCode from "qrcode";
import { qrCodes } from "./mockData/QRCodes";
import { ENDPOINTS } from "@globalShared/api/endpoints";

import {
  IQRcodeItem,
  IQRPort,
} from "@globalShared/types/entities/Qport.entity";
import { IProduct } from "@globalShared/types/entities/Product.entity";

import { getCryptoKeys } from "@utils/crypto/getCryptoKeys";
import { PRODUCTS } from "@mockData/PRODUCTS";
import { currentQRportSessions } from "@mockData/currentSessions";
import { ApiError } from "@utils/basicApiFncs/ApiError";
import { createEndpoint } from "@utils/basicApiFncs/createEndpoint";
import { IMessage } from "@globalShared/types/entities/Order.entity";

const PORT = 3000;
const serverId = "serverName" + "_" + crypto.randomUUID();

const app = express();

// create session for each QR-code
qrCodes.forEach((item) => {
  const newSession: IQRPort = {
    id: crypto.randomUUID(),
    role: "guest",
    status: "open",
    users: [],
    messages: [],
    createdAt: Date.now() + "",
  };
  currentQRportSessions.push(newSession);
});

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

// GET - получить все существующие QR-codes
app.get(
  ENDPOINTS.qrcodes.getAll,
  createEndpoint<void, IQRcodeItem[]>(async () => {
    if (!qrCodes.length) {
      throw new ApiError(404, "No items");
    }
    return qrCodes;
  }),
);

// POST создать QR-code
app.post(
  ENDPOINTS.qrcodes.create,
  createEndpoint<{ name: string }, IQRcodeItem>(async (req, authData) => {
    const { name } = req.body;

    if (qrCodes.some((i) => i.name.toLowerCase() === name.toLowerCase())) {
      throw new ApiError(409, "Already exist!");
    }

    // Твой IP из локальной сети (замени на свой, если нужно)
    const serverIp = "192.168.0.100";
    const url = `http://${serverIp}:${PORT}/client?code=${name}`;

    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    });
    qrCodes.push({ id: Date.now(), name, qrDataUrl });
    return { id: Date.now(), name, qrDataUrl };
  }),
);

// DELETE - удалить QR-code
app.delete(
  ENDPOINTS.qrcodes.deleteServer,
  createEndpoint<void, void, { id: string }>(async (req) => {
    const { id } = req.params;

    const index = qrCodes.findIndex((i) => i.id === +id);
    if (index === -1) {
      throw new ApiError(404, "QR-not found");
    }
    qrCodes.splice(index, 1);
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

// post - get all orders by qrCodeId
app.post(
  ENDPOINTS.orders.getAll,
  createEndpoint<{ qrCodeId: string }, IMessage[]>(async (req) => {
    const { qrCodeId } = req.body;

    const token = req.headers.authorization?.split(" ")[1];

    if ((!qrCodeId || !token) && !allowedIps.includes(req.ip || "")) {
      throw new ApiError(401, "Unauthorized");
    }

    const result: IMessage[] = currentQRportSessions
      .filter((item) => item.id === qrCodeId)
      .flatMap((item) => item.messages);

    return result;
  }),
);

app.post(
  ENDPOINTS.orders.create,
  createEndpoint<IMessage, IMessage>(async (req) => {
    const newOrder = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    if (newOrder.clientId !== token) {
      throw new ApiError(409, "Invalid token");
    }

    const session = currentQRportSessions.find(
      (item) => item.id === newOrder.qrCodeId,
    );
    if (!session) {
      throw new ApiError(404, "Session not found");
    }

    session.messages.push({ ...newOrder });
    return newOrder;
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

// app.post(
//   ENDPOINTS.session.start,
//   createEndpoint<{ qrCodeId: string }, { qrCodeId: string; sessionId: string }>(
//     async (req, authData) => {
//       const { qrCodeId } = req.body;
//       const current = currentQportSessions.find(
//         (item) => item.qrCodeId === qrCodeId,
//       );

//       if (current?.status === "private") {
//         throw new ApiError(409, "Session private!");
//       }

//       if (!current) {
//         const newSession: IQRPort = {
//           id: crypto.randomUUID(),
//           qrCodeId: qrCodeId,
//           createdAt: Date.now() + "",
//           messages: [],
//           status: "open",
//           users: [],
//         };
//         currentQportSessions.push(newSession);

//         return { qrCodeId, sessionId: newSession.id };
//       } else {
//         return { qrCodeId, sessionId: current.id };
//       }
//     },
//   ),
// );

// ADMIN RESTRICTIONS!!!
app.get(
  ENDPOINTS.session.getAll,
  createEndpoint<void, string[]>(async (req) => {
    return currentQRportSessions.map((item) => item.id);
  }),
);

app.delete(
  ENDPOINTS.session.close,
  createEndpoint<{ id: string }, void>(async (req) => {
    const { id } = req.body;
    const index = currentQRportSessions.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new ApiError(404, "Session not found");
    } else {
      currentQRportSessions.splice(index, 1);
    }
  }),
);

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
