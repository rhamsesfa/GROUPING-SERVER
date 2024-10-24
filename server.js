const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const server = http.createServer(app);

// Configuration de Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Stockage des utilisateurs connectés
const connectedUsers = new Map();


const { addMessageweb } = require('./controllers/Message'); // Import du contrôleur d'ajout de message


io.on('connection', (socket) => {
  console.log('Nouvelle connexion socket établie');

  socket.on('userConnected', (userId) => {
    console.log(`Utilisateur ${userId} connecté`);
    connectedUsers.set(userId, socket.id);

    // Notifier les autres utilisateurs
    socket.broadcast.emit('userStatusChanged', { userId, status: 'online' });
  });

  socket.on('joinRoom', ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join('-');
    socket.join(roomId);
    console.log(`Utilisateur a rejoint la room : ${roomId}`);
  });

  // Gestion de l'envoi de messages
  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const roomId = [senderId, receiverId].sort().join('-');
    const receiverSocketId = connectedUsers.get(receiverId);

    // Émettre immédiatement le message à la room
    const temporaryMessage = {
      text: message.text,
      date: new Date(),
      sender: senderId,
      status: 'pending', // Statut temporaire en attente de sauvegarde
    };
    io.to(roomId).emit('messageReceived', temporaryMessage);

    // Sauvegarde du message en base
    try {
      const savedMessage = await addMessageweb({
        senderId,
        receiverId,
        text: message.text,
      });

      // Mise à jour du statut à "envoyé"
      io.to(roomId).emit('messageStatusUpdate', {
        _id: savedMessage._id,
        status: 'sent',
      });

      // Notifier le destinataire s'il est connecté mais pas dans la room
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessageNotification', {
          senderId,
          message: savedMessage,
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du message:', error);
      socket.emit('messageError', { error: 'Erreur lors de l\'envoi du message' });
    }
  });

  socket.on('disconnect', () => {
    const userId = [...connectedUsers.entries()]
      .find(([_, socketId]) => socketId === socket.id)?.[0];

    if (userId) {
      connectedUsers.delete(userId);
      socket.broadcast.emit('userStatusChanged', { userId, status: 'offline' });
    }
    console.log('Utilisateur déconnecté');
  });
});


const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};


server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
