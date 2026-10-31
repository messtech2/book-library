FROM node:22-alpine AS dev
WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY . .
CMD ["yarn", "run", "dev"]