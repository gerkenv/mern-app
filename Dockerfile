# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
# https://medium.freecodecamp.org/how-to-deploy-a-node-js-application-to-amazon-web-services-using-docker-81c2a2d7225b
# define from what image we want to build from
FROM node:8-alpine
# Create app directory to hold the application code inside the image
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=production
# If you are building your code for production
# RUN npm install --only=production

# Bundle your app's source code inside the Docker image
COPY . .

# Build a client app
RUN npm run heroku-postbuild

# App binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 5000

# Define the command to run your app using CMD which defines your runtime
CMD [ "npm", "start" ]