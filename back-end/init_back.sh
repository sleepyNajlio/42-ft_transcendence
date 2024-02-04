npm install

npx prisma init

npx prisma generate

npx prisma migrate reset --force

npx prisma migrate dev --name luis_nani

# Start the Nest.js application in the background as the node user
npm run start:dev &

# Start Prisma Studio in the foreground as the node user
npx prisma studio

sleep 2