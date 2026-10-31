FROM node:22-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile

COPY . .
CMD ["yarn", "run", "dev", "--", "--host", "0.0.0.0"]