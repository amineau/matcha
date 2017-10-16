FROM node:6

RUN mkdir -p /app/media

WORKDIR /app

ADD package.json /app

RUN npm install

ADD index.html /app
ADD webpack.config.js /app

EXPOSE 8080

CMD npm run start