import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
//import ResponseInterceptor ;


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix( "api" ) ; // localhost:PORT/api

  app.enableVersioning( {type: VersioningType.URI, defaultVersion: '1'} ); // localhost:PORT/api/v1 => API REST | o por ej localhost:PORT/api/v2 => API GraphQL

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true ,
        forbidNonWhitelisted: true ,
        transform: true
      }
    )
  );

  //app.useGlobalInterceptors( new ResponseInterceptor() )


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
