FROM node:boron
RUN apt-get update -y
RUN apt-get -y install && \
	apt-get update && \
	npm install -g @angular/cli 

WORKDIR /movie-app
COPY . ./

RUN npm install 
RUN npm run build

EXPOSE 3000
CMD ["node","app.js"]


