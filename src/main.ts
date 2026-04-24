import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);

    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            //* Evitamos campos que no necesitamos en cada peticion
            whitelist: true,
            forbidNonWhitelisted: true,

            transform: true,
            transformOptions: {
                //* Evitamos que nuestros campos tomen valores undefined si no los pasamos en dtos
                exposeUnsetFields: false,
                //* Convertimos los datos que obtenemos segun nuestro dto
                enableImplicitConversion: true,
            },
        })
    )

}
bootstrap();
