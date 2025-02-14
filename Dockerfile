FROM node:20-alpine
RUN mkdir /app
COPY . /app/
WORKDIR /app
# Run npm build and remove any source files
RUN npm ci --ignore-scripts && npm run build && rm -rf src/
