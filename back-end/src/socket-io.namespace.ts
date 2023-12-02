import { Server } from 'socket.io';

const io = new Server({
  cors: {
    origin: '*',
  },
});

io.of('/events');
io.of('/chat');

export { io };
