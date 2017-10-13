FROM node:6

RUN mkdir -p /app/logs /app/media

WORKDIR /app

ADD package.json /app

RUN npm install

EXPOSE 4242

CMD npm run start