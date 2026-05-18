import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import crypto from "crypto";

// Simple in-memory stores
const feedbackStore: any[] = [];
const sessionStore = new Map<string, { role: string; name: string; lastName: string; group: string; expiresAt: number }>();

// Load shared secret for handoff token validation
const FERIA_SHARED_SECRET = process.env.FERIA_SHARED_SECRET || "";

interface HandoffPayload {
  role: string;
  module: string;
  name?: string;
  lastName?: string;
  group?: string;
  exp?: number;
}

function verifyHandoffToken(token: string): { valid: boolean; payload?: HandoffPayload; error?: string } {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Formato de token inválido" };
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode payload
    const payload: HandoffPayload = JSON.parse(
      Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    );

    // Check module
    if (payload.module !== "feria") {
      return { valid: false, error: "El token no corresponde al módulo Feria" };
    }

    // Check role
    if (!["teacher", "admin", "staff"].includes(payload.role)) {
      return { valid: false, error: "Rol no autorizado para el panel docente" };
    }

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false, error: "El token ha expirado" };
    }

    // Verify signature if shared secret is configured
    if (FERIA_SHARED_SECRET) {
      const expectedSignature = crypto
        .createHmac("sha256", FERIA_SHARED_SECRET)
        .update(`${headerB64}.${payloadB64}`)
        .digest("base64url");

      if (signatureB64 !== expectedSignature) {
        return { valid: false, error: "Firma del token inválida" };
      }
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "No se pudo validar el token" };
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(express.json());

  // --- API Routes ---

  // Feedback
  app.post("/api/feedback", (req, res) => {
    const feedback = req.body;
    feedback.timestamp = new Date().toISOString();
    feedback.id = Date.now().toString();
    feedbackStore.push(feedback);
    console.log("Feedback received:", feedback);
    res.status(201).json({ success: true, message: "Feedback saved successfully", feedback });
  });

  app.get("/api/feedback", (req, res) => {
    res.json(feedbackStore);
  });

  // --- Feria Auth Endpoints ---

  // POST /api/feria/handoff — validate token from SASE, create session
  app.post("/api/feria/handoff", (req, res) => {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      res.status(400).json({ valid: false, error: "Token no proporcionado" });
      return;
    }

    const result = verifyHandoffToken(token);
    if (!result.valid || !result.payload) {
      res.status(401).json({ valid: false, error: result.error });
      return;
    }

    const { role, name, lastName, group } = result.payload;

    // Create server-side session
    const sessionId = crypto.randomUUID();
    const expiresAt = Date.now() + 1000 * 60 * 60 * 8; // 8 hours

    sessionStore.set(sessionId, {
      role,
      name: name || "Docente/Admin",
      lastName: lastName || "",
      group: group || "",
      expiresAt,
    });

    // Clean expired sessions periodically
    if (sessionStore.size % 10 === 0) {
      for (const [id, s] of sessionStore) {
        if (s.expiresAt < Date.now()) sessionStore.delete(id);
      }
    }

    res.json({
      valid: true,
      session: {
        token: sessionId,
        role,
        name: name || "Docente/Admin",
        lastName: lastName || "",
        group: group || "",
        expiresAt,
      },
    });
  });

  // GET /api/feria/session — validate current session
  app.get("/api/feria/session", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.json({ valid: false, error: "No hay sesión activa" });
      return;
    }

    const sessionId = authHeader.slice(7);
    const session = sessionStore.get(sessionId);

    if (!session) {
      res.json({ valid: false, error: "Sesión no encontrada" });
      return;
    }

    if (session.expiresAt < Date.now()) {
      sessionStore.delete(sessionId);
      res.json({ valid: false, error: "Sesión expirada" });
      return;
    }

    res.json({
      valid: true,
      session: {
        token: sessionId,
        role: session.role,
        name: session.name,
        lastName: session.lastName,
        group: session.group,
        expiresAt: session.expiresAt,
      },
    });
  });

  // POST /api/feria/logout — destroy session
  app.post("/api/feria/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const sessionId = authHeader.slice(7);
      sessionStore.delete(sessionId);
    }
    res.json({ success: true });
  });

  // --- Socket.io for Notifications ---
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Clients can join rooms (e.g. "teachers", "students")
    socket.on("join", (role) => {
      socket.join(role);
      console.log(`Socket ${socket.id} joined room: ${role}`);
    });

    // Handle sending notifications
    socket.on("send_notification", (data) => {
      // data format: { target: 'teachers' | 'students' | 'all', message: string, title: string, type: 'info'|'warning'|'success' }
      console.log("Notification received:", data);
      
      const payload = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...data
      };

      if (data.target === 'all') {
        io.emit("notification", payload);
      } else {
        io.to(data.target).emit("notification", payload);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // --- Vite Middleware (Development) or Static Files (Production) ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
