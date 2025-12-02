import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import * as schema from './src/schema'; 
import 'dotenv/config'; 


if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing from .env');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  console.log('Seeding database...');

  const adminEmail = 'admin@example.com'; 
  const adminPassword = 'admin';
  const adminPhone = '+911234567890';

  const existingUser = await db.query.user.findFirst({
    where: eq(schema.user.email, adminEmail),
  });

  if (existingUser) {
    console.log(`⚠️  User with email ${adminEmail} already exists. Skipping creation.`);
    await pool.end();
    return;
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

  try {
    await db.insert(schema.user).values({
      name: 'System Admin',
      email: adminEmail,
      phone: adminPhone,
      role: 'admin',
      password_hash: hashedPassword,
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Role: admin`);
    console.log(`   Phone: ${adminPhone}`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    
    await pool.end();
  }
}

seed();