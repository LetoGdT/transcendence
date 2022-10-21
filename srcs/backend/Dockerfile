FROM node:16

WORKDIR /usr/src/app

RUN npm i -g @nestjs/cli && \
	npm i --save @nestjs/config && \
	npm i --save @nestjs/axios && \
	npm i bcrypt && \
	npm i -D @types/bcrypt

CMD ["npm", "run", "start:dev"]