<!-- # ETAP Test Case Assessment

A simple REST API to mock a bus ticketing platform

## Tech Stack

**Server:** Node, Express.js

**Database:** MySQL

**ORM:** Prisma
## Documentation

[Documentation](https://documenter.getpostman.com/view/21867518/2s9YXiY1Kx)


## Running the app

Clone the project

```bash
git clone https://github.com/mahfuz67/ship-bubble-code-assessment
```

Copy the content of .env.example file to a new file .env and replace the variables with the appropriate values.

To run locally, You must have MySQL installed and running on your machine or use the connections string of a hosted MySQL server.

Install dependencies

```bash
npm install
```

Start the server locally

```bash
npm run start:migrate:dev
```

Start server with docker

Replace `localhost` in the `DATABASE_URL` environment variable with the name of the mysql container `mysql` 

```bash
# Run in Dev
docker compose -f docker-compose.dev.yml up --build 

# Run Prod
docker compose -f docker-compose.yml up --build

# Kill dev (Remove volumes)
docker compose -f docker-compose.dev.yml down -v

# Kill prod (Remove volumes)
docker compose -f docker-compose.yml down -v
```


## Running Tests

To run tests, run the following command

```bash
npm run start:migrate:test
```
 -->
