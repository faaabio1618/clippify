FROM node:18-bullseye-slim


EXPOSE 3000
WORKDIR /app
COPY . .

RUN apt-get update && apt-get install -y -q libfontconfig1

RUN npm install
RUN npm run build

# You'll probably want to remove this in production, it's here to make it easier to test things!
RUN rm -f prisma/dev.sqlite
RUN npx prisma migrate dev --name init

CMD ["npm", "run", "start"]
