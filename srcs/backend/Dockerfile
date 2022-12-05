FROM node:16

WORKDIR /usr/src/app

RUN npm i -g @nestjs/cli

COPY . .

RUN npm i

CMD ["npm", "run", "start:dev"]
