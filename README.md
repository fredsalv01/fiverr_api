# Fiverr API
Welcome to the Fiverr API repository!

This is a clone of the Fiverr backend that allows users to register, create profiles, and purchase services through the platform. Currently, only the backend of the application is available.

To use this application, you will need to have Node.js and MongoDB installed. Follow the steps below:

1. Clone this repository to your local machine:
```
  git clone https://github.com/fredsalv01/fiverr_api.git 
```
2. Install the necessary dependencies:
```
  npm install
```
3. Create a .env file in the root of the project with the following environment variables:
```
PORT=<the-port-on-which-the-application-will-run>
MONGODB_URI=<the-URL-of-your-MongoDB-instance>
JWT_SECRET=<a-secret-password-used-to-generate-and-verify-JWT-tokens>
```
Also agregate your stripe secret_key to use the payment method with stripe if you want.

4. Start the application:
```
npm start
```

The application will start at localhost:<the-port-on-which-the-application-will-run>.

To test the API endpoints, you can use tools such as Postman or Insomnia. The available endpoints are:

/api/users - endpoint for creating new users.
/api/auth/login - endpoint for authenticating users.
/api/services - endpoint for creating new services.
/api/orders - endpoint for creating new orders.
Thank you for using Fiverr API! If you have any questions or suggestions, please do not hesitate to contact us through the "Issues" section on GitHub.


See the complete documentation in this link https://documenter.getpostman.com/view/26055928/2s93JqS5H2
