import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class NamespaceIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    // const eventsNamespace = server.of('/events'); // Creating a namespace for 'events'
    // eventsNamespace.on('matchmaking', (socket: any) => {
    //   console.log(`Client ${socket.id} connected to the 'events' namespace.`);
    //   // Example: Broadcasting to clients in the 'events' namespace
    //   eventsNamespace.emit('message', 'Hello from the "events" namespace!');
    // });
    return server;
  }
}
