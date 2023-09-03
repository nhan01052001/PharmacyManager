import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './module/auth.module';
import { DatabaseModule } from './module/database.module';
import { entities } from './entities.provider';
import { UserModule } from './module/user.module';

@Module({
  imports: [
    // read file .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
