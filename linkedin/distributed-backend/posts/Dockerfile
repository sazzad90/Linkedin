FROM node:18-alpine

RUN npm install -g nodemon

WORKDIR /linkedin/posts

COPY . .

RUN npm install 

CMD ["npm", "run", "start"]