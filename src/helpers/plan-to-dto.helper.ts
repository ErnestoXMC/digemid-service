import { plainToInstance, ClassConstructor } from 'class-transformer';

//* Para metodos findone
export function toDto<T>(DtoClass: ClassConstructor<T>, plain: object): T {
    return plainToInstance(DtoClass, plain, { excludeExtraneousValues: true });
}

//* Para metodos findall
export function toDtoList<T>(DtoClass: ClassConstructor<T>, plain: object[]): T[] {
    return plainToInstance(DtoClass, plain, { excludeExtraneousValues: true });
}
