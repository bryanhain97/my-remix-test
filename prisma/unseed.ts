import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function unseed() {
  const { count: deletedCount } = await db.joke.deleteMany({});
  console.log(`Deleted count of database entries: ${deletedCount}`);
}

unseed();
