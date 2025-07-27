FROM node:16.14.0-alpine

# ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install

COPY . .

# RUN yarn install --omit=dev

RUN yarn build

USER node

CMD [ "yarn", "start"]

EXPOSE 3333

# docker build . -t jocanola/markety-server
# docker run -it -p 3333:3333 jocanola/markety-server
# docker push 
# RUN yarn global add pm2
# "start": "pm2 start dist/server.js -l logs.txt -i max",
