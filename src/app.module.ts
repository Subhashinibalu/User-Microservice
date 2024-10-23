import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';

@Module({
  imports: [ ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get("DATABASE_URL"),
        };
      },
      inject: [ConfigService],
    }),UserModule],
  controllers: [AppController,UserController],
  providers: [AppService],
})
export class AppModule {}
