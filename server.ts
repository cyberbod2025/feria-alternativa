import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import fs from "fs";

// Simple in-memory store for feedback
const feedbackStore: any[] = [];

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
