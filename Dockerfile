FROM node:18-bullseye-slim


EXPOSE 3000
WORKDIR /app
COPY . .

RUN echo "deb http://archive.debian.org/debian/ jessie contrib main non-free\ndeb-src http://archive.debian.org/debian/ jessie main contrib non-free" >> /etc/apt/sources.list
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 7638D0442B90D010

RUN apt-get update
RUN apt-get install ttf-mscorefonts-installer

RUN npm install
RUN npm run build

# You'll probably want to remove this in production, it's here to make it easier to test things!
RUN rm -f prisma/dev.sqlite
RUN npx prisma migrate dev --name init

CMD ["npm", "run", "start"]
