<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# nest.js-virgool

This project is a practical implementation of a blog platform inspired by [Virgool.io](https://virgool.io). Built using the powerful **NestJS** framework, it demonstrates modern web application practices with scalability, security, and performance in mind.

## Features

- **User Authentication**: Secure registration, login, and session management using OTP.
- **Google OAuth 2.0**: Seamless social login with Google, implemented using Passport.
- **Article Management**: CRUD operations for articles with categories and tags.
- **Comment System**: Nested comments for article discussions.
- **RESTful APIs**: Clean and documented APIs for integration.
- **Swagger Documentation**: Interactive API docs using Swagger.
- **File Uploads**: Support for uploading article images using Multer.

## Table of Content

- [nest.js-virgool](#nestjs-virgool)
  - [Features](#features)
  - [Table of Content](#table-of-content)
  - [Prerequisites](#prerequisites)
  - [Technologies Used](#technologies-used)
    - [Backend](#backend)
    - [DevOps](#devops)
    - [Utilities](#utilities)
  - [Installation and Setup](#installation-and-setup)
  - [Run Postgres and PgAdmin using docker](#run-postgres-and-pgadmin-using-docker)
    - [Run PostgreSQL service](#run-postgresql-service)
    - [Run PgAdmin service](#run-pgadmin-service)
      - [Create a New PostgreSQL Server and database](#create-a-new-postgresql-server-and-database)
  - [Setting Up Google OAuth 2.0](#setting-up-google-oauth-20)
  - [Setting Up SMS.ir](#setting-up-smsir)
  - [Setting Up Mailtrap.io](#setting-up-mailtrapio)
  - [Updating the `.env` File](#updating-the-env-file)
  - [Compile and run the project](#compile-and-run-the-project)
  - [Accessing Swagger UI](#accessing-swagger-ui)
  - [Testing Google OAuth](#testing-google-oauth)
  - [License](#license)
  - [Contributors](#contributors)

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Docker](https://www.docker.com)
- [PostgreSQL](https://www.postgresql.org/)
- [pgAdmin](https://www.pgadmin.org/)
- [Sms.ir sms provider account](https://sms.ir/)
- [Google OAuth2.0 credentials](https://console.cloud.google.com/)
- [Mailtrap email delivery account](https://mailtrap.io/)

## Technologies Used

The project utilizes a modern tech stack to ensure high performance, scalability, and maintainability:

### Backend

- **[NestJS](https://nestjs.com/)**: Framework for building efficient and scalable server-side applications.
- **[TypeORM](https://typeorm.io/)**: ORM for database interactions.
- **[Passport.js](https://www.passportjs.org/)**: Authentication middleware, including Google OAuth 2.0.
- **[Multer](https://github.com/expressjs/multer)**: Middleware for handling file uploads.
- **[@nestjs-modules/mailer](https://github.com/nest-modules/mailer)**: Email module integrated with Nodemailer.
- **[Nodemailer](https://nodemailer.com/)**: Email sending service.

### DevOps

- **Environment Variables**: Configuration via `.env` files for sensitive data.
- **Database Migration**: Automated database schema management using TypeORM.

### Utilities

- **[Mailtrap.io](https://mailtrap.io/)**: Email testing platform.
- **[SMS.ir API](https://www.sms.ir/)**: SMS notifications and OTPs.
- **Swagger**: Interactive API documentation.
- **Pagination**: Custom created Pagination utility inspired by `nestjs-typeorm-paginate` module.
- **Exception Filter**: Custom response logic for exceptions.
- **Response interceptor**: Custom response logic for server responses.

## Installation and Setup

In order to get this application up and running on your local machine, follow the
steps below.

1. Clone the repository from GitHub:

   ```shell
   git clone https://github.com/saeedNW/nest.js-virgool.git
   ```

2. Navigate to the project directory:

   ```shell
   cd nest.js-virgool
   ```

3. Install project dependencies:

   ```shell
   npm install
   ```

Note that the application default Listing port is `3000`.

## Run Postgres and PgAdmin using docker

To begin using this project, the first step is to install and run a **PostgreSQL** database. If you don't already have PostgreSQL installed, you can follow these instructions to set it up using Docker containers.

### Run PostgreSQL service

Using this command you can pull and run PostgreSQL database.

```bash
docker run -d \
  --name postgres_container \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=root \
  -p 5432:5432 \
  postgres
```

This command initiates a PostgreSQL container with username and password authentication (postgres/root).

### Run PgAdmin service

PgAdmin is the most popular and feature rich Open Source administration and development platform for PostgreSQL. Using this command you can pull and run PgAdmin.

```bash
docker run -d \
  --name pgadmin_container \
  -e PGADMIN_DEFAULT_EMAIL=admin@example.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  -p 8080:80 \
  --link postgres_container:postgres \
  dpage/pgadmin4
```

This command starts a pgAdmin container with management UI available at <http://localhost:8080>. Log in using the email and password you specified in the docker run command for pgAdmin (<admin@example.com>/admin).

#### Create a New PostgreSQL Server and database

To create a new PostgreSQL server in pgAdmin, follow these steps:

- In the left sidebar, under "Servers", right-click on "Servers" and select "Create" > "Server..."
- Fill in the following details:
  - **Name:** Give your server a name (localhost).
  - **Connection:** Fill in the following details:
    - **Host name/address:** `postgres` (this is the name of the PostgreSQL container)
    - **Port:** `5432`
    - **Username:** The username you specified when running the PostgreSQL container
    - **Password:** The password you specified when running the PostgreSQL container
- Click on the "Save" button.

Once the server is created, you’ll need to set up a database to enable the application’s connection.

- In the left sidebar, under "Servers", Open the newly created database and right-click on "databases" and select "Create" > "database"
- Fill in the following details:
  - **Database:** Give your database a name (For this project the name should be virgool).
- Click on the "Save" button.

## Setting Up Google OAuth 2.0

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).

2. **Create a new project**:

   - Click the dropdown at the top of the page, then select **New Project**.
   - Enter a project name and organization (if applicable), then click **Create**.

3. **Set up OAuth Consent Screen**:

   - Go to **APIs & Services > OAuth consent screen**.
   - Select **External**.
   - Fill in the required details, such as application name, support user email, and developer contact information.
   - You don't need to change other info in this and nest pages
   - Click **SAVE AND CONTINUE** and **BACK TO DASHBOARD** at the last page

4. **Create OAuth 2.0 Client ID**:

   - Navigate to **APIs & Services > Credentials**.
   - Click **Create Credentials**, then select **OAuth Client ID**.
   - Select the application type as **Web application**.
   - Enter a name for the client ID.
   - Add the **Authorized redirect URIs** (e.g., `http://localhost:3000/auth/google/redirect`).
   - Save the credentials, and note the **Client ID** and **Client Secret**.

5. **Download credentials**:
   - Click on your newly created client ID.
   - Click **Download JSON**, or manually copy the **Client ID** and **Client Secret**.

## Setting Up SMS.ir

1. Visit [SMS.ir](https://www.sms.ir/) and create an account.
2. Verify your account by completing the required authentication steps.
3. Navigate to the **API Settings** section in your dashboard.
4. Generate your **API Key** for integration.

## Setting Up Mailtrap.io

1. Go to [Mailtrap.io](https://mailtrap.io/) and sign up for a free account.
2. Once signed in, create a new inbox.
3. In the inbox settings, note the **SMTP credentials**:
   - `MAILTRAP_USER` (SMTP username)
   - `MAILTRAP_PASS` (SMTP password)

## Updating the `.env` File

update The `.env` file in the project root and add the following environment variables:

```env
SMS_IR_API_KEY=your-sms-ir-api-key
MAILTRAP_USER=your-mailtrap-username
MAILTRAP_PASS=your-mailtrap-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build production
$ npm run build

# production mode
$ npm run start:prod
```

## Accessing Swagger UI

This application provides interactive API documentation using Swagger.

To access the Swagger UI:

1. Start the application in development or production mode.
2. Open your web browser and navigate to:

   ```bash
   http://localhost:3000/api-doc
   ```

3. Use the Swagger interface to explore and test the available APIs.

## Testing Google OAuth

To test the Google OAuth 2.0 login process:

1. Ensure the application is running in development or production mode.
2. Open your web browser and navigate to:

   ```bash
   http://localhost:3000/auth/google
   ```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Contributors

We would like to thank the following individuals who have contributed to the development of this application:

![avatar](https://images.weserv.nl/?url=https://github.com/erfanyousefi.png?h=150&w=150&fit=cover&mask=circle&maxage=5d)
‎ ‎ ‎ ![avatar](https://images.weserv.nl/?url=https://github.com/saeedNW.png?h=150&w=150&fit=cover&mask=circle&maxage=5d)

[**Erfan Yousefi - Supervisor and instructor of the nest.js programming course**](https://github.com/erfanyousefi/)

[**Saeed Norouzi - Back-end Developer**](https://github.com/saeedNW)
