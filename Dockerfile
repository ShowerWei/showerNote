FROM node:0.10.38

RUN mkdir /src

RUN npm install nodemon -g

WORKDIR /src
ADD showerNote/package.json /src/package.json
RUN npm install

ADD showerNote/nodemon.json /src/nodemon.json

EXPOSE 3000

CMD npm start