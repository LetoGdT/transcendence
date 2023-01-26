FROM node:latest

WORKDIR /usr/src/app

RUN npm i -g @nestjs/cli

COPY . .

RUN npm i

RUN npm run build

CMD ["node", "dist/main.js"]
