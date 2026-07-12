# Stage 1: Build the React application
FROM node:20-alpine AS build

RUN corepack enable && corepack prepare yarn@4.17.1 --activate

WORKDIR /app

COPY .yarn ./.yarn
COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

COPY . .
RUN yarn build

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
