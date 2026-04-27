/**
 * Crea un tipo objeto donde todas las claves son de tipo KeyType y todos los valores son de tipo ValueType.
 * Record<KeyType, ValueType>
 */

export interface FilterSimplePagination {
    take: number,
    skip: number,
    order?: Record<string, 'ASC' | 'DESC'>
}

export interface FilterStatusPagination extends FilterSimplePagination {
    where: {
        isActive?: boolean
    }
}
