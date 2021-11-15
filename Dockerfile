FROM node:14

COPY package.json . 
COPY index.js . 
COPY yarn.lock . 

RUN yarn

EXPOSE 8080

# port 8080
CMD node index.js

