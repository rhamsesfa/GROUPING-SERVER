const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken"); // JWT pour la vérification du token envoyé par socket.io
const app = require("./app");

const server = http.createServer(app);

// Clé secrète pour JWT (remplacer par une clé sécurisée dans un fichier d'env)
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb";

const { addMessageweb } = require("./controllers/Message"); // Import du contrôleur d'ajout de message

// Configuration de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Stockage des utilisateurs connectés
const connectedUsers = new Map();

// Middleware pour vérifier le token JWT
io.use((socket, next) => {
  const token = socket.handshake.auth?.token; // Récupérer le token des données d'authentification

  if (!token) {
    return next(new Error("Token manquant"));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Token invalide:", err);
      return next(new Error("Authentification échouée"));
    }

    // Ajouter l'ID de l'utilisateur décodé au socket
    socket.userId = decoded.userId;
    next();
  });
});

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
  console.log(`Utilisateur ${socket.userId} connecté`);

  // Ajouter l'utilisateur aux utilisateurs connectés
  connectedUsers.set(socket.userId, socket.id);
  console.log(connectedUsers)

  // Notifier les autres utilisateurs de l'état de connexion
  socket.broadcast.emit("userStatusChanged", {
    userId: socket.userId,
    status: "online",
  });

  // Rejoindre une room
  socket.on("joinRoom", ({ receiverId }) => {
    const roomId = [socket.userId, receiverId].sort().join("-");
    socket.join(roomId);
    console.log(`Utilisateur ${socket.userId} a rejoint la room : ${roomId}`);
  });

  // Gestion de l'envoi de messages
  socket.on("sendMessage", async ({ roomId1, receiverId, message }) => {
    const roomId = roomId1;
    const receiverSocketId = connectedUsers.get(receiverId);

    const temporaryMessage = {
      text: message.text,
      date: new Date(),
      sender: message.sender,
      status: "pending",
    };

    // Émettre immédiatement le message à la room
    io.to(roomId).emit("messageReceived", temporaryMessage);

    try {
      const savedMessage = await addMessageweb({
        senderId: socket.userId,
        receiverId,
        text: message.text,
      });

      // Mise à jour du statut du message
      io.to(roomId).emit("messageStatusUpdate", {
        _id: savedMessage._id,
        status: "sent",
      });

      if (receiverSocketId) {
        temporaryMessage.message['_id'] = savedMessage._id;
        io.to(receiverSocketId).emit("newMessageNotification", {
          senderId: socket.userId,
          message: savedMessage,
          temporaryMessage
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du message:", error);
      socket.emit("messageError", {
        error: "Erreur lors de l'envoi du message",
      });
    }
  });

  // Gestion de la déconnexion
  socket.on("disconnect", () => {
    connectedUsers.delete(socket.userId);
    socket.broadcast.emit("userStatusChanged", {
      userId: socket.userId,
      status: "offline",
    });
    console.log(`Utilisateur ${socket.userId} déconnecté`, connectedUsers);
  });
});

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);