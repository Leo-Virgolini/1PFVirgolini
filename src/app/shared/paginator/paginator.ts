import { MatPaginatorIntl } from '@angular/material/paginator';

const rango = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
        return `0 de ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex: number = page * pageSize;

    const endIndex: number =
        startIndex < length
            ? Math.min(startIndex + pageSize, length)
            : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function getPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = 'Items por página:';
    paginatorIntl.nextPageLabel = 'Siguiente';
    paginatorIntl.previousPageLabel = 'Anterior';
    paginatorIntl.getRangeLabel = rango;

    return paginatorIntl;
}
