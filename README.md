# Banking API

This is a RESTful API for a banking system.
It allows you to manage bank accounts, including creating
new accounts, updating existing accounts, retrieving accounts,
and deleting accounts.

## Features

- Create a new account
- Update an existing account
- Retrieve an account by account number
- Retrieve an account by name
- Retrieve all accounts
- Delete an account

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM

## Getting Started

These instructions will get you a copy of the project up and
running on your local machine for development and testing purposes.

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

- `GET /api/accounts`: Retrieve all accounts
- `GET /api/accounts/:accountNumber`: Retrieve an account by account number
- `GET /api/accounts/name/:name`: Retrieve an account by name
- `POST /api/accounts`: Create a new account
- `PUT /api/accounts/:accountNumber`: Update an account
- `DELETE /api/accounts/:accountNumber`: Delete an account

## Running Tests

To run the tests, use the following command: `npm test`

## Contributing

If you want to contribute to this project, please create a pull request.
For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under Nicanor Kyamba.
