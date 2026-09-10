import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';
import { ModelsModule } from './models/models.module';
import { VersionsModule } from './versions/versions.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth/auth.guard';
import { RolesGuard } from './auth/guards/role/roles.guard';
//import { ClassSerializerInterceptor } from '@nestjs/common';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CarsModule,
    ModelsModule,
    VersionsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
    /*
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
    */
  ],
})

export class AppModule {}
