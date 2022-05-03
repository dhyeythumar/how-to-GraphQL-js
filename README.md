<h1 align="center">
    How To GraphQL using JavaScript
</h1>

<h5 align="center">
    GraphQL Authentication
    <span> &bull; </span>
    GraphQL Subscriptions
    <span> &bull; </span>
    Prisma (ORM)
    <span> &bull; </span>
    Apollo Server Express
    <span> &bull; </span>
    Filtering, Pagination & Sorting
</h5>

## What’s In This Document

-   [Introduction](#introduction)
-   [Setup Instructions](#setup-instructions)
-   [Getting Started](#getting-started)
-   [License](#license)

## Introduction

This repo contains the code for the concepts I learned from "[How to GraphQL - Node.js Tutorial](https://www.howtographql.com/graphql-js/0-introduction/)".

## Setup Instructions

0. Clone the repository

    ```bash
    git clone https://github.com/dhyeythumar/how-to-GraphQL-js.git
    cd how-to-GraphQL-js
    ```

1. Install the dependencies

    ```bash
    npm install
    ```

2. Adding Database using Prisma **(if you choose not to use the existing prisma files from this repo then follow this step else jump to step 3)**

    _(Prisma is an open source database toolkit for JS & TS that makes it easy for developers to reason about their data and how they access it.)_

    - Using Prisma CLI to initialize Prisma

        ```bash
        npx prisma init
        ```

    - Now specifies your database connection & add your schema into `prisma/schema.prisma` (for example check this [schema.prisma](https://github.com/dhyeythumar/how-to-GraphQL-js/blob/main/prisma/schema.prisma) file)

3. Migration changes from schema **(existing prisma's schema file have the complete implementation)**

    - Run the migration (this will also create prisma client)

        ```bash
        npx prisma migrate dev --name "<add-message-here>"
        ```

    - To generate prisma client (as I mentioned that client is created with the migrations but if you still want to create then you use the following)

        ```bash
        npx prisma generate
        ```

4. Exploring the data using Prisma Studio **(open another terminal so studio can run parallelly)**

    _(Prisma Studio is a powerful database GUI where you can interact with your data)_

    ```bash
    npx prisma studio
    ```

## Getting Started

Testing your GraphQL server

```bash
npm run dev
```

As indicated by the terminal output, the server is now running on http://localhost:4000/graphql. To test the API of your server, open a browser and navigate to this URL.

## License

Licensed under the [MIT License](./LICENSE).
