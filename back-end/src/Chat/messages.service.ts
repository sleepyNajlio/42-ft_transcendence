import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatType, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type ChatWhereInput = Prisma.ChatWhereInput;

@Injectable()
export class MessagesService {
  public clients = [];

  constructor(private prisma: PrismaService) {}

  async identify(
    id: number,
    name: string,
    selectedType: string,
    selectedPswd: string,
  ) {
    let chatUSers: any = null;


    const existingChat = await this.prisma.chat.findFirst({
      where: {
        name: {
          equals: name,
        },
      } as ChatWhereInput,
      include: {
        bannedUsers: true,
        mutedUsers: true, // Include bannedUsers in the query result
      },
    });

    // Check if the bannedUsers include the player with id_player equal to id
    const isBanned = existingChat.bannedUsers.some(
      (user) => user.id_player === id,
    );
    const isMuted = existingChat.mutedUsers.some(
      (user) => user.id_player === id,
    );

    if (existingChat.type === 'PROTECTED') {
      chatUSers = await this.prisma.chatUser.findFirst({
        where: {
          chatId: existingChat.id_chat,
          userId: id,
        },
      });
      const isPasswordMatch = await bcrypt.compare(selectedPswd, existingChat.password);
       if (!isPasswordMatch && chatUSers === null) {
     
        return false;
      }
      if (chatUSers) {
        return existingChat;
      } else {
        if (isBanned || isMuted) {
          chatUSers = await this.prisma.chatUser.create({
            data: {
              chatId: existingChat.id_chat,
              userId: id,

              isBanned: isBanned ? true : false,
              isMuted: isMuted ? true : false,
            },
          });
        } else {
          chatUSers = await this.prisma.chatUser.create({
            data: {
              chatId: existingChat.id_chat,
              userId: id,
            },
          });
        }
      }
    } else {
      chatUSers = await this.prisma.chatUser.findFirst({
        where: {
          chatId: existingChat.id_chat,
          userId: id,
        },
      });
      if (chatUSers) {
        // chatUSers = await this.prisma.chatUser.update({
        //   where: {
        //     id_chat_user: chatUSers.id_chat_user,
        //   },
        //   data: {
        //     joinedAt: new Date(),
        //   },
        // });
        return existingChat;
      } else {
        if (isBanned || isMuted) {
          chatUSers = await this.prisma.chatUser.create({
            data: {
              chatId: existingChat.id_chat,
              userId: id,

              isBanned: isBanned,
              isMuted: isMuted,
            },
          });
        } else {
          chatUSers = await this.prisma.chatUser.create({
            data: {
              chatId: existingChat.id_chat,
              userId: id,
            },
          });
        }
      }
    }

    return existingChat;
  }

  async getChatUsers(name: string, id: number) {
    const blocked = await this.prisma.friendShip.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
        status: 'BLOCKED',
      },
    });

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
        OR: [
          {
            AND: [
              { userId: { notIn: blocked.map((user) => user.userId) } },
              { userId: { notIn: blocked.map((user) => user.friendId) } },
            ],
          },
        ],
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
    return newChatUser;
  }

  async getSocketByUserId(id: number) {
    const socketId = this.clients[id];
    if (socketId) {
      return this.clients[id];
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
    if (existingChat) {
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
      return newChat;
    }
  }

  //////////////////////// CREATE CHANNEL /////////////////////////

  async createChannel(
    id: number,
    name: string,
    roomType: ChatType,
    roomPassword: string,
  ) {

    type roomType = 'PUBLIC' | 'PRIVATE' | 'PROTECTED';
    const roomType1: roomType = roomType as roomType;
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

    const chatUser = await this.prisma.chatUser.create({
      data: {
        chatId: newChat.id_chat,
        userId: id,
        role: 'OWNER',
      },
    });
    newChat = {...newChat, chatUser};
    return newChat;
    // return Object.values(this.clients);
  }

  getClientName(clientId: string) {
    return this.clients[clientId];
  }

  //////////////////////// CREATE MESSAGE /////////////////////////

  async create(
    createMessageDto: CreateMessageDto,
    clientId: string,
  ) {

    const message = {
      name: createMessageDto.name,
      text: createMessageDto.text,
      id : createMessageDto.id,
      username: createMessageDto.username,
    };
    let createdChatMessage = null;
    if (message.username === null) {
      const chat = await this.prisma.chat.findFirst({
        where: {
          name: message.name,
        },
      });
      const chatUser = await this.prisma.chatUser.findFirst({
        where: {
          userId: message.id,
          chatId: chat.id_chat,
        },
      });
      if (chatUser.isBanned || chatUser.isMuted) {
        return false;
      }

      createdChatMessage = await this.prisma.chatMessage.create({
        data: {
          message: message.text,
          chatId: chat.id_chat as number,
          userId: message.id as number,
        },
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
              friendshipAsked: true,
              friendshipReceived: true,
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
              users: { some: { userId: message.id } },
            },
            {
              users: { some: { userId: user.id_player } },
            },
          ],
        } as ChatWhereInput,
      });

      createdChatMessage = (await this.prisma.chatMessage.create({
        data: {
          message: message.text,
          chatId: chat.id_chat as number,
          userId: message.id as number,
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

    }

    return createdChatMessage;
  }

  /////////////// find Room Messages /////////////////////////

  async findAllMessages(name: string, id: number) {
    let Messages: any = null;

    const user = await this.prisma.player.findFirst({
      where: {
        id_player: id,
      },
    });

    const blocked = await this.prisma.friendShip.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
        status: 'BLOCKED',
      },
    });

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


    if (chatUser && chatUser.isBanned) {
      Messages = await this.prisma.chatMessage.findMany({
        where: {
          AND: [
            { chatId: chat.id_chat },
            { sentAt: { gte: chatUser.joinedAt } },
            { sentAt: { lt: chatUser.updatedAt } },
          ],
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
    }
    else {
      Messages = await this.prisma.chatMessage.findMany({
        where: {
          AND: [
            { chatId: chat.id_chat },
            { sentAt: { gt: chatUser.joinedAt } },
            {
              OR: [
                { userId: id },
                {
                  AND: [
                    { userId: { notIn: blocked.map((user) => user.userId) } },
                    { userId: { notIn: blocked.map((user) => user.friendId) } },
                  ],
                },
              ],
            },
          ],
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
    }

    return Messages;
  }

  ///////////////////// find Dm Messages /////////////////////////

  async findAllDm(name: string, id: number, username: string) {
    let Messages = null;

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
      Messages = await this.prisma.chatMessage.findMany({
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
    return Messages;
  }
  async findRoom(name: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });

    return chat;
  }

  //////////////////////// GET USERS /////////////////////////

  async getUsers(id: number) {
    const friends = await this.prisma.friendShip.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
        status: 'ACCEPTED',
      },
      include: {
        user: {
          select: {
            id_player: true,
            username: true,
          },
        },
        friend: {
          select: {
            id_player: true,
            username: true,
          },
        },
      },
    });

    const friendsIds = friends.map((friend) => {
      if (friend.userId === id) {
        return friend.friendId;
      }
      return friend.userId;
    });



    const chats = await this.prisma.chat.findMany({
      where: {
        type: 'PRIVATE',
        name: null,
        users: {
          some: {
            userId: id,
          },
        },
      },
    });
    const users = await this.prisma.player.findMany({
      where: {
        id_player: { in: friendsIds },
      },
      include: {
        chats: {
          select: {
            chatId: true,
          },
        },
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
    const lastMesssage = [];
    chats.map((chat) => {
      lastMesssage.push(
        lastMessages.find((message) => message.chatId === chat.id_chat),
      );
    });

    return users.map((user) => {
      let lastMessage = null;
      lastMesssage.map((message) => {
        if (message) {
          if (
            (message.userId === user.id_player || message.userId === id) &&
            user.chats.find((chat) => chat.chatId === message.chatId)
          ) {
            lastMessage = message;
          }
        }
      });
      return {
        ...user,
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
    const blocked = await this.prisma.friendShip.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
        status: 'BLOCKED',
      },
    });

    const chatUsers = await this.prisma.chatUser.findMany({
      where: {
        chatId: { in: rooms.map((room) => room.id_chat) },
      },
    });
    const lastMessages = await this.prisma.chatMessage.findMany({
      where: {
        AND: [
          { chatId: { in: rooms.map((room) => room.id_chat) } },
          { sentAt: { gte: chatUsers.find((chatUser) => chatUser.userId === id)?.joinedAt } },
          {
            OR: [
              { userId: id },
              {
                AND: [
                  { userId: { notIn: blocked.map((user) => user.userId) } },
                  { userId: { notIn: blocked.map((user) => user.friendId) } },
                ],
              },
            ],
          },
        ],
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

    return rooms.map((room) => {
      const chatUser = chatUsers.find(
        (chatUser) =>
          chatUser.chatId === room.id_chat && chatUser.userId === id,
      );
      const lastMessage = lastMessages.find(
        (message) =>
          message.chatId === room.id_chat &&
          message.sentAt >= chatUser?.joinedAt, // Filter messages sent after chatUser joined
      );
      return {
        ...room,
        chatUser: chatUser,
        lastMessage: lastMessage,
      };
    });
  }

  //////////////LEAVE/////////////////////

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

  ///////////////////// Ban ///////////////////////

  async ban(id: number, name: string) {
    let bannedChatUser: any = null;
    let player = await this.prisma.player.findFirst({
      where: {
        id_player: id,
      },
    });
    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });
    const chatUser = await this.prisma.chatUser.findFirst({
      where: {
        userId: id,
        chatId: chat.id_chat,
        isBanned: false,
        isMuted: false,
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
    if (!chatUser) {
      return false;
    }
    if (chatUser.role === 'ADMIN') {
      bannedChatUser = await this.prisma.chatUser.update({
        where: {
          id_chat_user: chatUser.id_chat_user,
        },
        data: {
          isBanned: true,
          role: 'MEMBER',
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
      await this.prisma.chat.update({
        where: {
          id_chat: chat.id_chat,
        },
        data: {
          bannedUsers: {
            connect: {
              id_player: player.id_player,
            },
          },
        },
      });
      return bannedChatUser;
    } else {
      bannedChatUser = await this.prisma.chatUser.update({
        where: {
          id_chat_user: chatUser.id_chat_user,
        },
        data: {
          isBanned: true,
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
    }
    await this.prisma.chat.update({
      where: {
        id_chat: chat.id_chat,
      },
      data: {
        bannedUsers: {
          connect: {
            id_player: player.id_player,
          },
        },
      },
    });

    return bannedChatUser;
  }

  ////////////////////////// MUTE /////////////////////////

  async mute(id: number, name: string) {
    let player = await this.prisma.player.findFirst({
      where: {
        id_player: id,
      },
    });

    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });
    const chatUser = await this.prisma.chatUser.findFirst({
      where: {
        userId: id,
        chatId: chat.id_chat,
        isMuted: false,
        isBanned: false,
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
    if (!chatUser) {
      return false;
    }
    let mutedChatUser: any = null;
    if (chatUser.role === 'ADMIN') {
      mutedChatUser = await this.prisma.chatUser.update({
        where: {
          id_chat_user: chatUser.id_chat_user,
        },
        data: {
          isMuted: true,
          role: 'MEMBER',
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
    } else {
      mutedChatUser = await this.prisma.chatUser.update({
        where: {
          id_chat_user: chatUser.id_chat_user,
        },
        data: {
          isMuted: true,
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
    }
    await this.prisma.chat.update({
      where: {
        id_chat: chat.id_chat,
      },
      data: {
        mutedUsers: {
          connect: {
            id_player: player.id_player,
          },
        },
      },
    });
    setTimeout(
      async () => {
        // Check if the user still exists in the chat
        const existingUser = await this.prisma.chatUser.findFirst({
          where: {
            userId: id,
            chatId: chat.id_chat,
          },
        });

        if (existingUser) {
          // User still exists, update the mute status

          mutedChatUser = await this.prisma.chatUser.update({
            where: {
              id_chat_user: existingUser.id_chat_user,
            },
            data: {
              isMuted: false,
            },
          });
        } else {
          // User no longer exists, handle accordingly (e.g., log a message)
        }
        await this.prisma.chat.update({
          where: {
            id_chat: chat.id_chat,
          },
          data: {
            mutedUsers: {
              disconnect: {
                id_player: player.id_player,
              },
            },
          },
        });
      },
      5 * 60 * 1000,
    );
    return mutedChatUser;
  }
  /////////////////////Add User ///////////////////////

  async addUser(id: number, username: string, name: string) {
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
    if (chatUser) {
      return false;
    }
    const newChatUser = await this.prisma.chatUser.create({
      data: {
        chatId: chat.id_chat,
        userId: user.id_player,
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
    await this.prisma.chat.update({
      where: {
        id_chat: chat.id_chat,
      },
      data: {
        bannedUsers: {
          disconnect: {
            id_player: user.id_player,
          },
        },
      },
    });
    return newChatUser;
  }

  ///////////////////////// UPDATE ROOM /////////////////////////

  async updateRoom(
    id: number,
    name: string,
    type: string,
    newPass: string,
    modifypass: boolean,
    setPass: boolean,
    removepass: boolean,
  ) {

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
    return newChat;
  }
}
