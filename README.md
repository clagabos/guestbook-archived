# Guestbook
This is a simple and self-hostable guestbook application. It uses express to host the server, a MySQL table to store the guestbook entries, and pug to render the pages.

CSS and HTML structure can be edited as wished, but I won't be providing any sort of support if something goes wrong - that's up to you to figure out.

As of now, it is quite susceptible to spam and has no built-in moderation tools, so it is not recommended to use this in a production environment as of now.

## Installation
- Clone the repository
- Run `yarn install` to install the dependencies
- Copy `.env.example` to `.env` and fill in the values with your own
- Create a MySQL database on your server called "guestbook" (or whatever you chose in your .env file)
- Run `yarn start` to start the server

## License
CC0-1.0 Universal

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## To-do
- [ ] Add moderation tools
- [ ] Add a captcha to prevent automated spam