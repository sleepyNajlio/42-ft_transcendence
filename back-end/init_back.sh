chown -R node:node ./

su node -c 'sleep 2 && id'
su node -c 'npm install'
su node -c 'npx -y prisma generate'
su node -c 'npx -y prisma migrate dev'

# Start the Nest.js application in the background as the node user
su node -c 'npm run start:dev' &

# Start Prisma Studio in the foreground as the node user
su node -c 'npx prisma studio'