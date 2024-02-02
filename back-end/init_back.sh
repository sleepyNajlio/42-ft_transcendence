sleep 2 && id
npm install
npx -y prisma generate
npx prisma migrate dev

# Start the Nest.js application in the background as the node user
npm run start:dev &

# Start Prisma Studio in the foreground as the node user
npx prisma studio