import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';

export const DB = Symbol('DB');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: 'postgresql://neondb_owner:npg_1twSWPBvmb5Z@ep-shy-waterfall-a18rfqbq-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DB],
})
export class DbModule { }
