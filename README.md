# Personal Budget App

Experimental application that allows you to record expenses and income. Create a user account and start keeping an additional record of your transactions, browse your transaction history, and check your balance at any time.

## Technology stack

### Environment

* Node.js + npm
* Express.js
* PostgreSQL
* Node PostgreSQL

### Security

* [JSON Web Token](https://www.npmjs.com/package/jsonwebtoken)
* [Bcrypt](https://www.npmjs.com/package/bcrypt)
* [Crypto Random Bytes](https://nodejs.org/api/crypto.html#cryptorandombytessize-callback)

## How to run it on your computer

1. Download the repository to your computer.
2. Navigate to the project folder using the terminal.
3. Run the `npm install` command to install the necessary dependencies.
4. Using `psql`, create a new database with the name of your choice and run the `personal_budget.sql` file using the command `\i /path/to/file/personal_budget.sql`.
5. Create an `.env` file in the project's root folder and define the following environment variables as listed below:
    ```
      PGUSER=database_user
      PGPASSWORD=database_password
      PGHOST=database_hostname
      PGPORT=database_connection_port
      PGDATABASE=database_name
      JWT_SECRET=key_generated_with_crypto.randomBytes()
    ```
6. Finally, run the command `node app.js` to run the app.

## Endpoints

### Users

- **Create user**
  - URL: `http://localhost:3000/auth/register`
  - Method: `POST`
  - Body (example):
    ```
    {
      "email": "myuser@mail.com",
      "password": "123456" 
    }
    ```
  - Response "200 OK" (example):
    ```
    [
      {
        "user_id": 1,
        "email": "myuser@mail.com",
        "created_at": "2026-05-12T13:24:44.163Z"
      }
    ]
    ```

- **Login user**
  - URL: `http://localhost:3000/auth/login`
  - Method: `POST`
  - Body (example):
    ```
    {
      "email": "myuser@mail.com",
      "password": "123456"
    }
    ```
  - Response "200 OK" (example):
    ```
    {
      "token": "548y38guejrkr920k45'3498g..."
    }
    ```

### Transactions

- **Create transaction**
  - URL: `http://localhost:3000/transactions`
  - Method: `POST`
  - Headers: `Authorization: Bearer <token>`
  - Body (example):
    ```
    {
      "title": "seven eleven",
      "type": "expense",
      "amount": "8.50",
      "note": "a drink for the night"
    }
    ```
  - Response "200 OK" (example):
    ```
    [
      {
        "transaction_id": 2,
        "title": "seven eleven",
        "type": "expense",
        "amount": "8.50",
        "note": "a drink for the night",
        "created_at": "2026-05-12T11:53:38.988948",
        "user_id": 1
      }
    ]
    ```

- **Get transactions**
  - URL: `http://localhost:3000/transactions`
  - Method: `GET`
  - Headers: `Authorization: Bearer <token>`
  - Response "200 OK" (example):
    ```
    [
      {
        "transaction_id": 2,
        "title": "seven eleven",
        "type": "expense",
        "amount": "8.50",
        "note": "a drink for the night",
        "created_at": "2026-05-12T11:53:38.988948",
        "user_id": 1
      },
      {
        "transaction_id": 3,
        "title": "cornerstore",
        "type": "expense",
        "amount": "10.35",
        "note": "some goods for the week",
        "created_at": "2026-05-12T20:53:17.782Z",
        "user_id": 1
      }
    ]
    ```

- **Update transaction**
  - URL: `http://localhost:3000/transactions/:id`
  - Method: `PUT`
  - Headers: `Authorization: Bearer <token>`
  - Body (example):
    ```
    {
      "title": "seveneleven",
      "type": "expense",
      "amount": "25.12",
      "note": "coke and chips"
    }
    ```
  - Response "200 OK" (example):
    ```
    [
      {
        "transaction_id": 2,
        "title": "seveneleven",
        "type": "expense",
        "amount": "25.12",
        "note": "coke and chips",
        "created_at": "2026-05-12T21:53:34.978948",
        "user_id": 1
      }
    ]
    ```

- **Delete transaction**
  - URL: `http://localhost:3000/transactions/:id`
  - Method: `DELETE`
  - Headers: `Authorization: Bearer <token>`
  - Response "200 OK" (example):
    ```
    [
      {
        "transaction_id": 3,
        "title": "cornerstore",
        "type": "expense",
        "amount": "10.35",
        "note": "some goods for the week",
        "created_at": "2026-05-12T20:53:17.782Z",
        "user_id": 1
      }
    ]
    ```

##  Deploy URL

https://personal-budget-app-1g0n.onrender.com