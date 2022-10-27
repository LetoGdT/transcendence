FROM node:16

WORKDIR /usr/src/app

RUN npm i -g @nestjs/cli && \
	npm i --save @nestjs/config && \
	npm i --save @nestjs/axios && \
	npm i bcrypt && \
	npm i -D @types/bcrypt && \
	npm install --save @nestjs/jwt passport-jwt && \
	npm install --save-dev @types/passport-jwt && \
	npm i cookie-parser && \
	npm i -D @types/cookie-parser && \
	npm install @nestjs/typeorm typeorm mysql2 && \
	npm install pg && \
	npm i --save @nestjs/passport passport && \
	npm install --save passport-jwt && \
	npm install --save-dev @types/passport-jwt && \
	npm install rand-token --save

CMD ["npm", "run", "start:dev"]