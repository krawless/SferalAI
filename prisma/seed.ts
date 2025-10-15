import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Parse DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  // Parse MySQL connection string: mysql://user:pass@host:port/database
  const urlPattern = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/;
  const match = databaseUrl.match(urlPattern);

  if (!match) {
    throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:pass@host:port/database');
  }

  const [, , , host, portStr, database] = match;
  const port = parseInt(portStr, 10);

  console.log('Parsed connection details:');
  console.log(`  Host: ${host}`);
  console.log(`  Port: ${port}`);
  console.log(`  Database: ${database}`);

  // Check if connection already exists
  const existingConnection = await prisma.connection.findFirst();

  if (existingConnection) {
    console.log('\nConnection record already exists. Skipping seed.');
    return;
  }

  // Create connection record
  const connection = await prisma.connection.create({
    data: {
      name: 'Primary Database',
      host,
      port,
      database,
      status: 'active',
    },
  });

  console.log('\nConnection record created:');
  console.log(connection);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

