FROM node:latest

WORKDIR /usr/src/app

COPY package*.json .

RUN npm i

COPY . .

CMD ["npm", "run", "start"]

# RUN npm run build

# RUN npm install -g serve

# CMD ["serve", "-s", "build"]
