import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';
import { ModelsModule } from './models/models.module';
import { VersionsModule } from './versions/versions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CarsModule, ModelsModule, VersionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
