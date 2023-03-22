# peer2peer

Peer2peer is a platform where programmers can connect and organize pair-programming sessions.

<img src="images/hero-desktop.png" alt="Screenshot of the hero section" width="value" width="400">

[Click here to see the live demo](https://inge-heeringa-final-project-2023-bcn.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/61b07391-6314-4376-a060-11b32ed7af83/deploy-status)](https://app.netlify.com/sites/inge-heeringa-final-project-2023-bcn/deploys)

#### SonarCloud Metrics

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Inge-Heeringa-Final-Project-front-202301-bcn&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Inge-Heeringa-Final-Project-front-202301-bcn)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Inge-Heeringa-Final-Project-front-202301-bcn&metric=coverage)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Inge-Heeringa-Final-Project-front-202301-bcn)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Inge-Heeringa-Final-Project-front-202301-bcn&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Inge-Heeringa-Final-Project-front-202301-bcn)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Inge-Heeringa-Final-Project-front-202301-bcn&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Inge-Heeringa-Final-Project-front-202301-bcn)

This web application is written in TypeScript and built with the MEAN stack. It relies on Angular on the front end, combined with NgRx to ensure a consistent state across various components.

The Material Angular library provides a sleek and professional look for the UI, while Sass is used for CSS preprocessing.

On the backend, I use Node.js with Express and MongoDB to provide a scalable and efficient infrastructure for storing and processing data. ([Click here to see the back-end code.](https://github.com/isdi-coders-2023/Inge-Heeringa-Final-Project-back-202301-bcn))

My testing suite includes Jest, Supertest and Angular Testing Library to ensure the application is functioning correctly and to instill confidence in my users that they can use the application with minimal risk of encountering bugs or errors.

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![Testing-Library](https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white)

## Features

### Posting requests

One of the key features of peer2peer is the ability for users to post requests for pair programming on certain features of their projects. Users introduce their project name and a brief description, and list the stack and technologies they are using. By indicating their level of experience, they guide other users to identify the best candidates for collaboration.

<p align="middle">
<img src="images/new-post.png" alt="Screenshot of submit form" width="value" height="400"> <img src="images/post.png" alt="Screenshot of post" width="value" height="400"> <img src="images/detail.png" alt="Screenshot of post detail" width="value" height="400">
</p>

### User authentication

I used JSON Web Token (JWT) for secure user authentication. By implementing JWT, my application ensures that sensitive data is stored safely and that only authorized users can access protected routes and features.

<p align="middle">
<img src="images/login.png" alt="Screenshot of login form" width="value" height="400"> <img src="images/sign-up.png" alt="Screenshot of register form" width="value" height="400">
</p>

### Image storage and optimization

One key area I focused on during development was performance, specifically optimizing images using Sharp. The result is a high-performing application that loads quickly. In addition, I chose Supabase as the application's cloud storage solution to provide secure and scalable storage for images.

## Future implementations

- Filter requests by stack, technologies and level of experience
- Interaction between users through direct messaging
- Schedule pair programming sessions in a shared calendar
- Redirect users to their platform of choice to connect and hold their pair programming session

## Getting started

To get started using peer2peer, you need to install:

- Node.js
- All the needed dependencies using <code>npm install</code> after cloning the repository

### Running the application

To run the application, use the following command:

<code>npm start</code>

### Testing

To run the tests, use the following command:

<code>npm run test</code>
