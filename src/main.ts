import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

//* Aplana los errores de validación anidados mostrando solo el mensaje, sin el prefijo del campo padre
function flattenValidationErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((error) => {
        if (error.children && error.children.length > 0) {
            return flattenValidationErrors(error.children);
        }
        return Object.values(error.constraints ?? {});
    });
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/digemid');

    app.enableCors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    //* Máximo tiempo de espera para las peticiones (útil para la carga masiva de Excel)
    app.use((req, res, next) => {
        res.setTimeout(60000); // 60 segundos
        next();
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

            //* Aplanamos los mensajes de errores anidados sin mostrar el prefijo del campo padre
            exceptionFactory: (errors: ValidationError[]) => {
                const messages = flattenValidationErrors(errors);
                return new BadRequestException(messages);
            },
        })
    )

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
