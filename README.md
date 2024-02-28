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

## Technologies Used
- **Frontend (React)**
- **Backend (NestJS)**
- **Database (PostgreSQL with Prisma)**
- **Docker and Docker Compose**

## Installation

1. Clone the repository from GitHub.
3. Configure environment variables for database connection and OAuth authentication.
4. Run the application using `docker compose up --build`

