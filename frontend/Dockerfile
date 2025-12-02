FROM node:20-alpine AS build

ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src

RUN npm install
RUN npm run build

FROM nginx:1.25-alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
