# Guestbook
This is a simple and self-hostable guestbook application. It uses express to host the server, a MySQL table to store the guestbook entries, and pug to render the pages. The guestbook form is secured with a CAPTCHA to prevent automated spam.

CSS and HTML structure can be edited as wished, but I won't be providing any sort of support if something goes wrong - that's up to you to figure out.

## Installation
- Clone the repository
- Run `yarn install` to install the dependencies
- Copy `.env.example` to `.env` and fill in the values with your own
    - You are going to want to create a Discord bot and add it to your server to use the Discord commands to hide and show guestbook entries. You can find a guide on how to do that [here](https://docs.discord.red/en/stable/bot_application_guide.html). The bot does not need any privileged gateway intents.
- Create a MySQL database on your server called "guestbook" (or whatever you chose in your .env file)
- Run `yarn start` to start the server

## License
CC0-1.0 Universal

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.