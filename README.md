# 📸 My Webcam App

This is a webapp allows users to test their webcams and upload snapshots with text to the server. The snapshots uploaded are shared to all users in realtime.

## Build the app yourself

### Requirements

-   Node.js: v16.x
-   PostgreSQL: v14

### Build on local

1. Clone this project.
2. Run `npm install` to install dependencies.
3. Start PostgreSQL database server.
4. Create `.env` file and fill the information. NOTE: replace `<PORT>` and `<DATABASE_NAME>` with your configuration.

```
DATABASE_URL="postgres://localhost:<PORT>/<DATABASE_NAME>"
DATABASE_SSL_DEV="true"
```

5. Run `npm start` to start the server.

### Deploy to [Heroku](https://www.heroku.com/home)

1. Follow the [instruction](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) to install Heroku CLI.
2. Run `heroku create <APP_NAME>` to create Heroku app.
3. Follow the [instruction](https://devcenter.heroku.com/articles/heroku-postgresql) to create a PostgreSQL database for your app.
4. Run `git push heroku main` to deploy to the Heroku server.
