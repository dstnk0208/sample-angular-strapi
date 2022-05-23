# OS: Debian Buster
# Node.js: 14.4.0
FROM node:14.4.0-buster

# Create app directory
WORKDIR /usr/src/app

# Listen port
EXPOSE 8080

# Run Node.js
CMD [ "node", "server.js" ]