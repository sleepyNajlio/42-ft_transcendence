import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatType, Prisma } from '@prisma/client';
// import { getUser } from 'src/player';

type ChatWhereInput = Prisma.ChatWhereInput;

@Injectable()
export class MessagesService {

  constructor(private prisma: PrismaService) {}

  async identify(
    id: number,
    name: string,
    selectedType: string,
    selectedPswd: string,
  ) {
    let chatUSers: any = null;

    // console.log('password in service: ');
    // console.log(selectedPswd);
    // console.log('called identify');

    const existingChat = await this.prisma.chat.findFirst({
      where: {
        name: {
          equals: name,
        },
      } as ChatWhereInput,
    });

    // console.log('id: ' + id + ' user: ' + name + ' is trying to join the chat');
    if (existingChat.type === 'PROTECTED') {
      chatUSers = await this.prisma.chatUser.findFirst({
        where: {
          chatId: existingChat.id_chat,
          userId: id,
        },
      });
      if (selectedPswd !== existingChat.password && chatUSers === null) {
        // console.log('id: ' + id + ' user: ' + name + ' cant join the chat because of wrong password');
        return false;
      }
      if (chatUSers) {
        // console.log('id: ' + id + ' user: ' + name + ' already joined the chat');
        return existingChat;
      } else {
        chatUSers = await this.prisma.chatUser.create({
          data: {
            chatId: existingChat.id_chat,
            userId: id,
          },
        });
      }
    } else {
      chatUSers = await this.prisma.chatUser.findFirst({
        where: {
          chatId: existingChat.id_chat,
          userId: id,
        },
      });
      if (chatUSers) {
        // console.log('id: ' + id + ' user: ' + name + ' already joined the chat');
        return existingChat;
      } else {
        chatUSers = await this.prisma.chatUser.create({
          data: {
            chatId: existingChat.id_chat,
            userId: id,
          },
        });
      }
    }
    // console.log('id: ' + id + ' user: ' + name + ' joined the chat');

    // console.log(existingChat);
    // console.log('-------------------');
    // console.log(chatUSers);
    return existingChat;
  }

  async getChatUsers(name: string, id: number) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });
    const chatUsers = await this.prisma.chatUser.findMany({
      where: {
        NOT: {
          userId: id,
        },
        chatId: chat.id_chat,
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    // console.log('chat users are: ');
    // console.log(chatUsers);
    return chatUsers;
  }

  async kick(id: number, name: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });
    const chatUser = await this.prisma.chatUser.findFirst({
      where: {
        userId: id,
        chatId: chat.id_chat,
      },
    });
    if (!chatUser) {
      console.log('user is not in the chat');
      return false;
    }
    const chatUserDeleted = await this.prisma.chatUser.delete({
      where: {
        id_chat_user: chatUser.id_chat_user,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        chat: {
          select: {
            name: true,
          },
        },
      },
    });
    return chatUserDeleted;
  }

  async setAdmin(id: number, username: string, name: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });
    const user = await this.prisma.player.findFirst({
      where: {
        username: username,
      },
    });
    const chatUser = await this.prisma.chatUser.findFirst({
      where: {
        userId: user.id_player,
        chatId: chat.id_chat,
      },
    });
    if (!chatUser) {
        console.log('user is not in the chat');
        return false;
    }
    const newChatUser = await this.prisma.chatUser.update({
      where: {
        id_chat_user: chatUser.id_chat_user,
      },
      data: {
        role: 'ADMIN',
      },
    });
    // console.log('new chat user is: ');
    // console.log(newChatUser);
    return newChatUser;
  }

  async getSocketByUserId(userId: number) {
    const socketId = this.clients[userId];
    // console.log('socket id is: ');
    // console.log(socketId);
    if (socketId) {
      return this.clients[userId];
    }
    return null;
  }

  // joining a dm

  async identifyDm(id: number, name: string, username: string) {
    const usertojoin = await this.prisma.player.findFirst({
      where: {
        username: name,
      },
    });

    const existingChat = await this.prisma.chat.findFirst({
      where: {
        AND: [
          { type: 'PRIVATE' },
          {
            users: { some: { userId: id } },
          },
          {
            users: { some: { userId: usertojoin.id_player } },
          },
        ],
      } as ChatWhereInput,
    });
    // console.log('id: ' + id + ' user: ' + username + ' is trying to join the chat');
    if (existingChat) {
      // console.log('id: ' + id + ' user: ' + username + ' already joined the chat');
      return existingChat;
    } else {
      const newChat = await this.prisma.chat.create({
        data: {
          type: 'PRIVATE',
          // name: name,
        },
      });
      await this.prisma.chatUser.create({
        data: {
          chatId: newChat.id_chat,
          userId: id,
        },
      });
      await this.prisma.chatUser.create({
        data: {
          chatId: newChat.id_chat,
          userId: usertojoin.id_player,
        },
      });
      // console.log('id: ' + id + ' user: ' + username + ' joined the chat');
      // console.log(newChat);
      // console.log('-------------------');
      // console.log(chatUSers);
      // console.log('-------------------');
      // console.log(chatUSers2);
      return newChat;
    }
  }

  async createChannel(
    id: number,
    name: string,
    roomType: ChatType,
    roomPassword: string,
  ) {
    console.log('id: ' + id + ' user: ' + name + ' been created');

    type roomType = 'PUBLIC' | 'PRIVATE' | 'PROTECTED';
    const roomType1: roomType = roomType as roomType;
    // console.log('room type: ');
    // console.log(roomType1);
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        name: {
          equals: name,
        },
      } as ChatWhereInput,
    });

    if (existingChat) {
      return false;
    }
    let newChat: any = null;
    if (roomType1 === 'PRIVATE' || roomType1 === 'PROTECTED') {
      newChat = await this.prisma.chat.create({
        data: {
          name: name,
          type: ChatType[roomType1],
          password: roomPassword,
        },
      });
    } else {
      newChat = await this.prisma.chat.create({
        data: {
          name: name,
        },
      });
    }

    await this.prisma.chatUser.create({
      data: {
        chatId: newChat.id_chat,
        userId: id,
        role: 'OWNER',
      },
    });

    // console.log(newChat);
    // console.log('-------------------');
    // console.log(chatUSers);
    return newChat;
    // return Object.values(this.clients);
  }

  getClientName(clientId: string) {
    return this.clients[clientId];
  }
  async create(
    createMessageDto: CreateMessageDto,
    clientId: string,
    id: number,
    username: string | null,
  ) {
    // console.log(createMessageDto.);

    const message = {
      name: createMessageDto.name,
      text: createMessageDto.text,
    };
    let createdChatMessage = null;
    if (username === null) {
      // console.log('username is null so its a channel');
      const chat = await this.prisma.chat.findFirst({
        where: {
          name: message.name,
        },
      });
      // console.log('chat that user want to send msg in : ');
      // console.log(chat);

      createdChatMessage = await this.prisma.chatMessage.create({
        data: {
          message: message.text,
          chatId: chat.id_chat as number,
          userId: id as number,
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
          chat: {
            select: {
              id_chat: true,
              name: true,
              type: true,
              users: true,
            },
          },
        },
      });
      // console.log('message that just got created : ');
      // console.log(createdChatMessage);
    } else {
      const user = await this.prisma.player.findFirst({
        where: {
          username: message.name,
        },
      });
      const chat = await this.prisma.chat.findFirst({
        where: {
          AND: [
            { type: 'PRIVATE' },
            {
              users: { some: { userId: id } },
            },
            {
              users: { some: { userId: user.id_player } },
            },
          ],
        } as ChatWhereInput,
      });
      // console.log('username ' + username + ' want to send msg to ' + message.name + 'in chat : ' + chat.id_chat);

      createdChatMessage = (await this.prisma.chatMessage.create({
        data: {
          message: message.text,
          chatId: chat.id_chat as number,
          userId: id as number,
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
          chat: {
            select: {
              id_chat: true,
              name: true,
              type: true,
            },
          },
        },
      })) as {
        user: { username: string };
        id3_chat_message: number;
        message: string;
        userId: number;
        chatId: number;
        sentAt: Date;
      };

      // console.log('message that just got created : ');
      // console.log(createdChatMessage);
    }

    return createdChatMessage;
  }
  async findAll(name: string, id: number, username: string) {
    // console.log('name: ');
    // console.log(name);
    let messages = null;
    if (username === null && id === 0) {
      messages = await this.prisma.chatMessage.findMany({
        where: {
          chat: {
            name: name,
          },
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
          chat: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      const user = await this.prisma.player.findFirst({
        where: {
          username: name,
        },
      });
      const chat = await this.prisma.chat.findFirst({
        where: {
          AND: [
            { type: 'PRIVATE' },
            {
              users: { some: { userId: id } },
            },
            {
              users: { some: { userId: user.id_player } },
            },
          ],
        } as ChatWhereInput,
      });
      if (chat) {
        messages = await this.prisma.chatMessage.findMany({
          where: {
            chatId: chat.id_chat,
          },
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        });
      }
    }
    return messages;
  }
  async findRoom(name: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });

    return chat;
  }

  async getUsers(id: number) {
    const users = await this.prisma.player.findMany({
      where: {
        NOT: {
          id_player: id,
        },
      },
    });
    const chats = await this.prisma.chat.findMany({
      where: {
        type: 'PRIVATE',
        name: null,
      },
    });
    const chatUsers = await this.prisma.chatUser.findMany({
      where: {
        chatId: { in: chats.map((room) => room.id_chat) },
      },
    });
    const lastMessages = await this.prisma.chatMessage.findMany({
      where: {
        chatId: { in: chats.map((room) => room.id_chat) },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
    });
    // console.log('last Messages is: ');
    // console.log(lastMessages);

    return users.map((user) => {
      const chatUser = chatUsers.find(
        (chatUser) =>
          chatUser.userId === user.id_player || chatUser.userId === id,
      );
      const lastMessage = lastMessages.find(
        (message) => message.userId === user.id_player || message.userId === id,
      );
      return {
        ...user,
        chatUser: chatUser,
        lastMessage: lastMessage,
      };
    });
  }

  async getRooms(id: number) {
    const rooms = await this.prisma.chat.findMany({
      where: {
        OR: [
          { type: { not: 'PRIVATE' } },
          {
            type: 'PRIVATE',
            users: { some: { userId: id } },
            name: { not: null },
          },
        ],
      },
    });

    const chatUsers = await this.prisma.chatUser.findMany({
      where: {
        chatId: { in: rooms.map((room) => room.id_chat) },
      },
    });

    const lastMessages = await this.prisma.chatMessage.findMany({
      where: {
        chatId: { in: rooms.map((room) => room.id_chat) },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
    });
    // console.log('last Messages is: ');

    // console.log(lastMessages);
    return rooms.map((room) => {
      const chatUser = chatUsers.find(
        (chatUser) =>
          chatUser.chatId === room.id_chat && chatUser.userId === id,
      );
      const lastMessage = lastMessages.find(
        (message) => message.chatId === room.id_chat,
      );
      return {
        ...room,
        chatUser: chatUser,
        lastMessage: lastMessage,
      };
    });
  }

  async leave(id: number, name: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });
    const chatUser = await this.prisma.chatUser.findFirst({
      where: {
        userId: id,
        chatId: chat.id_chat,
      },
    });
    const chatUserDeleted = await this.prisma.chatUser.delete({
      where: {
        id_chat_user: chatUser.id_chat_user,
      },
    });
    return chatUserDeleted;
  }

  async updateRoom(
    id: number,
    name: string,
    type: string,
    newPass: string,
    modifypass: boolean,
    setPass: boolean,
    removepass: boolean,
  ) {
    // console.log('update room called with id: ' + id + " and name" + name);

    let newChat: any = null;

    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });
    if (modifypass) {
      newChat = await this.prisma.chat.update({
        where: {
          id_chat: chat.id_chat,
        },
        data: {
          password: newPass,
        },
        include: {
          users: true,
        },
      });
    } else if (removepass) {
      newChat = await this.prisma.chat.update({
        where: {
          id_chat: chat.id_chat,
        },
        data: {
          password: null,
          type: 'PUBLIC',
        },
        include: {
          users: true,
        },
      });
    } else if (setPass) {
      newChat = await this.prisma.chat.update({
        where: {
          id_chat: chat.id_chat,
        },
        data: {
          password: newPass,
          type: 'PROTECTED',
        },
        include: {
          users: true,
        },
      });
    }
    // const Rooms = await this.getRooms(id);
    // console.log('rooms in service : ');
    // console.log(Rooms);
    return newChat;
  }
}
