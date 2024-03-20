# 42-TRANSCENDANCE

**Description**

The **42-TRANSCENDANCE** project aims to create a comprehensive web application that seamlessly combines gaming and social interaction. Our primary focus centers around delivering an engaging Pong gameplay experience, surrounded by a vibrant community of users. The platform includes robust features for user authentication, account management, chat functionality, and real-time multiplayer Pong gameplay. We emphasize security, user engagement, and a seamless gameplay experience.

## Features

### Security Concerns

- All passwords stored in the database are encrypted to enhance security.
- We've implemented protections against SQL injections to safeguard the website's integrity.
- Server-side validation ensures secure handling of forms and user inputs.

### User Account

- Users can log in using the OAuth system of 42 intranet for streamlined authentication.
- Choose a unique display name for your profile.
- Enjoy a comprehensive user profile with statistics, including victories, losses, ladder level, and achievements.
- Upload or generate avatars to personalize your account.
- Support for 2-factor authentication methods like Google Authenticator or SMS.
- Easily add friends, view their status, and access match history.

### Chat

- Create public, private, or protected channels for communication.
- Direct messaging capability between users.
- Ability to block other users, ensuring privacy and control over interactions.
- Channel ownership management, including password setting and administrator privileges.
- Administrators can ban, kick, or mute users for a specified duration (except channel owners).
- Integration with Pong gameplay allows users to initiate matches and view player profiles directly from the chat interface.

### Game

- Experience live multiplayer Pong gameplay directly on the website.
- Our match-making system automatically pairs players for exciting matches.
- Customize gameplay with power-ups and different maps.
- Responsive design ensures an optimal user experience across devices.
- We've considered network issues to ensure smooth gameplay even in challenging conditions.

### Tech Stack



- <img width='25' height='25' src='https://img.stackshare.io/service/1612/bynNY5dJ.jpg' alt='TypeScript'/> [TypeScript](http://www.typescriptlang.org) – Languages
- <img width='25' height='25' src='https://img.stackshare.io/service/8747/4zsOyxko_400x400.jpg' alt='NestJS'/> [NestJS](nestjs.com) – Frameworks (Full Stack)
- <img width='25' height='25' src='https://img.stackshare.io/service/1011/n1JRsFeB_400x400.png' alt='Node.js'/> [Node.js](http://nodejs.org/) – Frameworks (Full Stack)
- <img width='25' height='25' src='https://img.stackshare.io/service/1020/OYIaJ1KK.png' alt='React'/> [React](https://reactjs.org/) – Javascript UI Libraries
- <img width='25' height='25' src='https://img.stackshare.io/service/3350/8261421.png' alt='React Router'/> [React Router](https://github.com/rackt/react-router) – JavaScript Framework Components
- <img width='25' height='25' src='https://img.stackshare.io/service/1796/984368.png' alt='RxJS'/> [RxJS](http://reactivex.io/rxjs/) – Concurrency Frameworks
- <img width='25' height='25' src='https://img.stackshare.io/service/1028/ASOhU5xJ.png' alt='PostgreSQL'/> [PostgreSQL](http://www.postgresql.org/) – Databases
- <img width='25' height='25' src='https://img.stackshare.io/service/8680/Logo_Symbol_White.jpg' alt='Prisma'/> [Prisma](https://www.prisma.io/) – Object Relational Mapper (ORM)
- <img width='25' height='25' src='https://img.stackshare.io/service/1161/vI0ZZlhZ_400x400.png' alt='Socket.IO'/> [Socket.IO](http://socket.io/) – Realtime Backend / API
- <img width='25' height='25' src='https://img.stackshare.io/service/586/n4u37v9t_400x400.png' alt='Docker'/> [Docker](https://www.docker.com/) – Virtual Machine Platforms & Containers
- <img width='25' height='25' src='https://img.stackshare.io/service/3337/Q4L7Jncy.jpg' alt='ESLint'/> [ESLint](http://eslint.org/) – Code Review
- <img width='25' height='25' src='https://img.stackshare.io/service/830/jest.png' alt='Jest'/> [Jest](http://facebook.github.io/jest/) – Javascript Testing Framework
- <img width='25' height='25' src='https://img.stackshare.io/service/7035/default_66f265943abed56bcdbfca1c866a4261b1fbb063.jpg' alt='Prettier'/> [Prettier](https://prettier.io/) – Code Review
- <img width='25' height='25' src='https://img.stackshare.io/no-img-open-source.png' alt='SuperTest'/> [SuperTest](https://www.npmjs.com/package/supertest) – Javascript Testing Framework
- <img width='25' height='25' src='https://img.stackshare.io/service/21547/default_1aeac791cde11ff66cc0b20dcc6144eeb185c905.png' alt='Vite'/> [Vite](https://vitejs.dev/) – JS Build Tools / JS Task Runners
- <img width='25' height='25' src='https://img.stackshare.io/service/1682/IMG_4636.PNG' alt='Webpack'/> [Webpack](http://webpack.js.org) – JS Build Tools / JS Task Runners
- <img width='25' height='25' src='https://img.stackshare.io/service/3244/1_Mr1Fy00XjPGNf1Kkp_hWtw_2x.png' alt='Font Awesome'/> [Font Awesome](https://fontawesome.com/) – Fonts
- <img width='25' height='25' src='https://ucarecdn.com/8f3cac0e-b146-4f0f-878c-680a6671d804/' alt='Passport'/> [Passport](http://passportjs.org/) – User Management and Authentication
- <img width='25' height='25' src='https://img.stackshare.io/service/11104/iRsdwwuO_400x400.jpg' alt='SVG.js'/> [SVG.js](https://svgjs.com/) – Javascript Utilities & Libraries
- <img width='25' height='25' src='https://img.stackshare.io/service/4631/default_c2062d40130562bdc836c13dbca02d318205a962.png' alt='Shell'/> [Shell](https://en.wikipedia.org/wiki/Shell_script) – Shells
- <img width='25' height='25' src='https://img.stackshare.io/no-img-open-source.png' alt='axios'/> [axios](https://github.com/mzabriskie/axios) – Javascript Utilities & Libraries

Full tech stack [here](/techstack.md)

Full tech stack [here](/techstack.md)
## Installation

1. Clone the repository from GitHub.
3. Configure environment variables for database connection and OAuth authentication.
4. Run the application using `docker compose up --build`

