# peer2peer

Peer2peer is a platform where programmers can connect and organize pair-programming sessions.

#### SonarCloud Metrics

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Inge-Heeringa-Final-Project-back-202301-bcn&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Inge-Heeringa-Final-Project-back-202301-bcn)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Inge-Heeringa-Final-Project-back-202301-bcn&metric=coverage)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Inge-Heeringa-FinalProject-back-202301-bcn)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Inge-Heeringa-Final-Project-back-202301-bcn&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Inge-Heeringa-Final-Project-back-202301-bcn)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=isdi-coders-2023_Inge-Heeringa-Final-Project-back-202301-bcn&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=isdi-coders-2023_Inge-Heeringa-Final-Project-back-202301-bcn)

This web application is written in TypeScript and built with the MEAN stack. It relies on Angular on the front end, combined with NgRx to ensure a consistent state across various components.

The Material Angular library provides a sleek and professional look for the UI, while Sass is used for CSS preprocessing.

On the backend, I use Node.js with Express and MongoDB to provide a scalable and efficient infrastructure for storing and processing data.

My testing suite includes Jest, Supertest and Angular Testing Library to ensure the application is functioning correctly and to instill confidence in my users that they can use the application with minimal risk of encountering bugs or errors.

([Click here to see the front-end code.](https://github.com/isdi-coders-2023/Inge-Heeringa-Final-Project-front-202301-bcn))

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

## Endpoints

### Users

<code>POST /users/login</code>

- Log in to the application
- Fetch JSON web token
- Response
  - Status code 200
  - Token in body

<code>POST /users/register</code>

- Create an account for the application
- Response
  - Status code 201
  - Confirmation message in body

### Posts

#### Public

<code>GET /posts</code>

- Fetch a list of all posts
- Response
  - Status code 200
  - List of posts in body

#### Protected

<code>GET /posts/:id</code>

- Fetch one post by its id
- Response
  - Status code 200
  - Requested post in body

<code>POST /posts/submit</code>

- Add a new post to the database
- Response
  - Status code 201
  - Confirmation message in body

<code>DELETE /posts/delete/:id</code>

- Delete a post from the database
- Response
  - Status code 200
  - Confirmation message in body
