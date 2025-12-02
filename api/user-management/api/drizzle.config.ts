import { defineConfig, Config } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/**/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_1twSWPBvmb5Z@ep-shy-waterfall-a18rfqbq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
} as Config);

