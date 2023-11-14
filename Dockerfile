FROM node:18.18.2-alpine3.18 AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add g++ make py3-pip

RUN npm install
COPY --chown=node:node . .

####################### 
# BUILD FOR PRODUCTION 

FROM node:18.18.2-alpine3.18 AS build

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=development /usr/src/app/node_modules ./node_modules

COPY . .
RUN npm run build

ENV NODE_ENV production
ENV NODE_ENV=${NODE_ENV}

RUN npm install --omit=dev && npm cache clean --force

##############
# PRODUCTION 

FROM node:18.18.2-alpine3.18 AS production
RUN apk upgrade openssl libssl3 libcrypto3 apk-tools ssl_client
# RUN apk add --no-cache tzdata
# ENV TZ=Asia/Singapore

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# RUN chown -R node:node ./node_modules ./dist

CMD [ "node", "dist/main.js" ]
