import { ArgumentMetadata, BadRequestException, Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseStatusPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {

        //* Validacion para usar el pipe solo en parametros
        if (metadata.type !== 'param') {
            throw new InternalServerErrorException(
                `Configuración de código inválida: ParseStatusPipe está diseñado exclusivamente para parámetros de ruta (@Param). Se detectó su uso en un decorador @${metadata.type}().`
            );
        }

        //* Convertimos a string el valor
        const strValue = String(value);

        //* Valores Permitidos
        const validStatus = ['true', 'false'];

        //* Validacion en los estados
        if(!validStatus.includes(strValue)){
            throw new BadRequestException(`El estado '${value}' no es válido`);
        }

        //* Transformamos el string a booleano y retornamos
        const newValue = (strValue === 'true') ? true : false;

        return newValue;
    }
}
