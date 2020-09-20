FROM node:latest

# install dependencies
COPY package*.json ./
RUN npm install --only=production

# then copy over compiled code
COPY dist ./dist

EXPOSE 3001

CMD [ "node", "./dist/start.js" ]