
FROM node:18
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "src", "./"]

RUN npm install --production

COPY . .

RUN mkdir -p /run/secrets && \
    ln -s /run/secrets/my_env_file .env


CMD [ "node", "index.js" ]