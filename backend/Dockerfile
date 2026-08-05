FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5001

# Not `npm run dev`: nodemon would restart the process inside the container,
# so a crashed app would never surface to Kubernetes as a pod restart.
CMD ["npm", "start"]
