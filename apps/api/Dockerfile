FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json apps/api/
RUN npm install
COPY . .
RUN npm run build -w apps/api
CMD ["sh", "-c", "cd apps/api && npx prisma generate && npm run start"]
