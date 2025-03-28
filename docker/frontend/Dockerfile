FROM node:20 as build-stage
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 80

# docker build -t rupesh1997/user-management-service-frontend:1.0.0 -f ../docker/frontend/Dockerfile .