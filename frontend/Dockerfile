FROM node:20-alpine as build-stage

WORKDIR /app
COPY package*.json ./
ENV VITE_MAIN_SSO=https://sso.joltamp.pl/api/
ENV VITE_MAIN_BACKEND=https://uni.joltamp.pl/api/
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]