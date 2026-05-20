FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN npm install --prefix frontend
RUN npm install --prefix backend

EXPOSE 5174
EXPOSE 9000

CMD ["npm","run","dev"]
