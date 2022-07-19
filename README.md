# Mini demonstration of PayPal checkout
## Part of a curricular presentation - class Web Information System - 20212

### How to execute?

- Install necessary modules
```sh
npm i
(optional) npm i nodemon
```

- Configure some required environment variables that are stored in .env file. Log in to dashboard at https://developer.paypal.com
```sh
touch .env
PAYPAL_CLIENT_ID_DEFAULT=<YOUR_CLIENT_ID>
PAYPAL_CLIENT_SECRET_DEFAULT=<YOUR_SECRET_ID>
```

- Start server
```sh
npm start
```

- Open on browser
```sh
localhost:3000
```

- Account's credentials to log in during transaction
  Go to https://developer.paypal.com/developer/accounts and select corresponding sandbox account to proceed. You can also edit sandbox account's balance and other information.