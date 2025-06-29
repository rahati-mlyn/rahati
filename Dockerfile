FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set VITE_APP_ROOT to ensure Vite finds index.html
ENV VITE_APP_ROOT=.

RUN npm run build

# Install `serve` to serve the static files
RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]


