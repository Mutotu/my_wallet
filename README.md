# Assessment 5: Wallet (Full Stack)

> Max. completion time: 6h

In this assessment, you will create a wallet that helps users track their incomes and expenses.

![](assets/README/wallet.png)

## Back-End

> This section describes the work for the server in the `server` folder.

The back-end will manage a single resource: a _transaction_. The transaction has the following fields:

- `id` – Number, unique. Automatically set with an incrementing number.
- `amount` – Number. The amount in euros of the operation.
- `type` - String (`WITHDRAW`, `DEPOSIT`). It's the side of the operation, add/remove money from the wallet.
- `createdAt` - Date. The date at which the transaction was created.

### Database

Create and set up a database using Prisma ORM.

1. Create the DB.
2. Write the schemas.
3. Create and run the project's first migration.

### API

> You can find a Postman collection in the root folder of the exercise.

> Implement your solution in the `app.js` file. You don't need to create to call `listen`; In the `index.js` file I'm importing the app and calling it already.

Implement the following endpoints:

#### **`GET /balance`**

Returns an object with two fields:

- `balance` – String. The current balance of the wallet.
- `currency` – String. The currency symbol of the wallet.
- `transactions` – Array. A list of transactions in descending creation order (last created first). Every transaction has the following fields:
  - `id` – Number.
  - `amount` – String. The amount in string format.
  - `createdAt` – String. A date in ISO format when the transaction was created.
  - `type` – String. Either if it's a _DEPOSIT_ or a _WITHDRAWAL_.

**Example response**

```json
{
  "balance": "39.06",
  "currency": "€",
  "transactions": [
    {
      "id": 2,
      "amount": "20.00",
      "type": "DEPOSIT",
      "createdAt": "2022-07-17T19:01:43.382Z"
    },
    {
      "id": 1,
      "amount": "42.16",
      "type": "DEPOSIT",
      "createdAt": "2022-07-17T12:00:55.294Z"
    },
    {
      "id": 0,
      "amount": "23.10",
      "type": "WITHDRAWAL",
      "createdAt": "2022-07-17T09:51:05.184Z"
    }
  ]
}
```

#### **`POST /deposit`**

Creates a new deposit entry in the database. The `createdAt` should be set to the current time.

**Example request body**:

```json
{
  "amount": 20.0
}
```

Respond with a `201 Created` if created successfully. `400 Bad Request` if the `amount` is missing or not in the correct format.

**Example response**:

```json
{
  "id": 12,
  "amount": "20.00",
  "type": "DEPOSIT",
  "createdAt": "2022-07-17T09:51:05.184Z"
}
```

**Example of a failed request**:

```json
{
  "error": "Amount missing or incorrect format."
}
```

#### **`POST /withdrawal`**

Creates a new withdrawal entry in the database. The `createdAt` should be set to the current time.

**Example request body**:

```json
{
  "amount": 20.0
}
```

Respond with a `201 Created` if created successfully. `400 Bad Request` if the `amount` is missing or not in the correct format or if the wallet is missing funds (balance is lower than the amount).

**Example response**:

```json
{
  "id": 12,
  "amount": "20.00",
  "type": "WITHDRAWAL",
  "createdAt": "2022-07-17T09:51:05.184Z"
}
```

**Examples of a failed request**:

```json
{
  "error": "Amount missing or incorrect format."
}
```

```json
{
  "error": "Wallet missing funds."
}
```

## Front-End

> ℹ️ This section describes the work for the server in the `client` folder. A boilerplate project has been created using [Create React App](https://create-react-app.dev).

Implement a small React application that consumes the API you just created and renders it on screen. Allow the user to create new transactions.

> 🎨 You can find the original design [here](https://www.figma.com/file/sIRP0PUtPbwuW0f7Y4jjn5/Wallet).

Implement functionality first, then focus on design.

- The form comprises a selector, an input, and the submit button.
  - The selector should let the user choose between `DEPOSIT` and `WITHDRAW`.
  - The input should only allow a numeric format with two decimal digits.
  - When the user submits the form, if successfully posted, the form should be reset, and the transaction should appear on the screen and update the wallet's balance.
  - The submit button should be disabled if the text is empty.

## Extra credits

### Full Stack

- Add the current balance to the response of the endpoint for new transactions so the render of the new balance is more accurate.
- Allow the user to annotate the transaction by adding a text note.
- Allow the user to categorize the transactions and add a filter form (search by category and note) at the top of the transaction list.
