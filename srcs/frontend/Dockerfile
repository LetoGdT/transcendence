FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm i

RUN npm run build

RUN npm install -g serve

CMD ["serve", "-s", "build"]
