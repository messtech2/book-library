FROM node:22-alpine AS dev
WORKDIR /app
# Install dependencies based on the preferred package manager
COPY yarn.lock* package-lock.json*  package*.json ./
RUN yarn install --frozen-lockfile

COPY . .
CMD ["yarn", "run", "dev", "--", "--host", "0.0.0.0"]