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
          connectionString: 'postgresql://postgres:Mukunda;slaptop@localhost:5433/user_management',
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DB],
})
export class DbModule { }