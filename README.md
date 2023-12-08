# Banking API

This is a RESTful API for a banking system. It allows you to manage bank accounts and users, including creating new accounts and users, updating existing accounts and users, retrieving accounts and users, and deleting accounts and users.

## Features

### Account Management

- **Create a new account:** Add a new account to the system.
- **Update an existing account:** Modify the details of an existing account.
- **Retrieve an account by account number:** Fetch the details of a specific account using its account number.
- **Retrieve all accounts:** Get a list of all accounts in the system.
- **Delete an account:** Remove an account from the system.

### User Management

- **Create a new user:** Add a new user to the system. The user's password is hashed using bcrypt for security.
- **Update an existing user:** Modify the details of an existing user. If a new password is provided, it is hashed before being stored.
- **Retrieve a user by ID:** Fetch the details of a specific user using their ID.
- **Retrieve all users:** Get a list of all users in the system. Supports pagination to limit the number of users returned in a single request.
- **Delete a user:** Remove a user from the system.

## Technologies Used

- **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
- **PostgreSQL:** A powerful, open source object-relational database system.
- **Sequelize ORM:** A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.
- **bcrypt:** A library to help you hash passwords.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository: `git clone https://github.com/NICANORKYAMBA/my-bank-api.git`
2. Navigate into the project directory: `cd my-bank-api`
3. Install the dependencies: `npm install`
4. Create a `.env` file and add your database configuration. See `.env.example` for a sample configuration.
5. Start the server: `npm start`

## API Endpoints

### Account Endpoints

- `GET /api/accounts`: Retrieve all accounts
- `GET /api/accounts/:accountNumber`: Retrieve an account by account number
- `POST /api/accounts`: Create a new account
- `PUT /api/accounts/:accountNumber`: Update an account
- `DELETE /api/accounts/:accountNumber`: Delete an account

### User Endpoints

- `GET /api/users`: Retrieve all users
- `GET /api/users/:id`: Retrieve a user by ID
- `POST /api/users`: Create a new user
- `PUT /api/users/:id`: Update a user
- `DELETE /api/users/:id`: Delete a user

## Running Tests

To run the tests, use the following command: `npm test`

## Contributing

If you want to contribute to this project, please create a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under Nicanor Kyamba.