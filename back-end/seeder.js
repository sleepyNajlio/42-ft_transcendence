import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const generateRandomPlayerData = () => ({
  username: faker.internet.userName(),
  avatar: faker.image.avatar(),
  level: faker.number.int({ min: 1, max: 10 }),
  status: faker.helpers.arrayElement(['ONLINE', 'OFFLINE']),
  wins: faker.number.int({ min: 1, max: 1000 }),
  loses: faker.number.int({ min: 1, max: 1000 }),
});

const generateRandomFriendShipData = (userId, friendId) => ({
  status: faker.win,
  userId,
  friendId,
});

const generateRandomUserGameData = (userId, gameId) => ({
  score: faker.number.int({ min: 1, max: 1000 }),
  win: faker.number.int({ min: 1, max: 1000 }),
  userId,
  gameId,
});

const generateRandomGameData = () => ({
  status: faker.helpers.arrayElement(['SEARCHING', 'PLAYING', 'FINISHED']),
  createdAt: faker.date.recent(),
});

const generateRandomChatUserData = (userId, chatId) => ({
  role: faker.helpers.arrayElement(['MEMBER', 'ADMIN']),
  userId,
  chatId,
  joinedAt: faker.date.recent(),
});

const generateRandomChatData = () => ({
  type: faker.helpers.arrayElement(['GLOBAL', 'PRIVATE']),
  name: faker.internet.userName(),
  createdAt: faker.date.recent(),
  UpdatedAt: faker.date.recent(),
});

const generateRandomChatMessageData = (userId, chatId) => ({
  message: faker.lorem.sentence(),
  userId,
  chatId,
  sentAt: faker.date.recent(),
});

const seedDatabase = async () => {
  // Seed Player table
  const players = Array.from({ length: 10 }, () => generateRandomPlayerData());
  const createdPlayers = [];
  for (const player of players) {
    const createdPlayer = await prisma.player.create({ data: player });
    createdPlayers.push(createdPlayer);
  }

  // Seed FriendShip table
  const friendships = Array.from({ length: 10 }, (_, i) =>
    generateRandomFriendShipData(
      createdPlayers[i].id_player,
      createdPlayers[(i + 1) % 10].id_player,
    ),
  );
  await prisma.friendShip.createMany({ data: friendships });

  // Seed Game table
  const games = Array.from({ length: 10 }, () => generateRandomGameData());
  const createdGames = [];
  for (const game of games) {
    const createdGame = await prisma.game.create({ data: game });
    createdGames.push(createdGame);
  }

  // Seed UserGame table
  const userGames = Array.from({ length: 10 }, (_, i) =>
    generateRandomUserGameData(
      createdPlayers[i].id_player,
      createdGames[i].id_game,
    ),
  );
  for (const userGame of userGames) {
    await prisma.userGame.create({ data: userGame });
  }
  // Seed Chat table
  const chats = Array.from({ length: 10 }, () => generateRandomChatData());
  const createdChats = [];
  for (const chat of chats) {
    const createdChat = await prisma.chat.create({ data: chat });
    createdChats.push(createdChat);
  }

  // Seed ChatUser table
  const chatUsers = Array.from({ length: 10 }, (_, i) =>
    generateRandomChatUserData(
      createdPlayers[i].id_player,
      createdChats[i].id_chat,
    ),
  );
  await prisma.chatUser.createMany({ data: chatUsers });

  // Seed ChatMessage table
  const chatMessages = Array.from({ length: 10 }, (_, i) =>
    generateRandomChatMessageData(
      createdPlayers[i].id_player,
      createdChats[i].id_chat,
    ),
  );
  await prisma.chatMessage.createMany({ data: chatMessages });

  console.log('Database seeded successfully.');
};

seedDatabase()
  .catch((error) => console.error(error))
  .finally(async () => {
    await prisma.$disconnect();
  });
