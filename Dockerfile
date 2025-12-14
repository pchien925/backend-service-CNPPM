FROM node:18-alpine

WORKDIR /usr/src/utefood

RUN apk add --no-cache python3 make g++ bash

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8001

CMD ["npm", "run", "start:prod"]
