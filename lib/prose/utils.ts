import { Node } from "prosemirror-model";

type TNode = {
    type: string;
    content: TNode[];
    attrs?: {
        [name: string]: string;
    };
};
/**
 * Отдает список всех идентификаторов изображений из документа
 * @param content сериализованный в строку контент в формате prose
 * @returns массив цифровых идентификаторов изображений в статье
 */
export const getImageIdsFromProse = (content: string): number[] => {
    try {
        const ids: number[] = [];
        const doc = JSON.parse(content);
        if (typeof doc !== 'object') throw new Error('Content is not object');
        if (doc.type !== 'doc') throw new Error('Content type does not have doc value');
        // console.dir(doc);
        // Рекурсивная функция обхода узлов     
        function descendants (node: TNode, prefix: string) {
            // console.log(`${prefix} ${node.type}`);
            if (node.type === 'image' && node.attrs?.fid) {
                // fid в image может быть null|number|string|undefined
                const fid = parseInt(node.attrs?.fid + '');
                if (!isNaN(fid)) ids.push(fid);
            }
            if (!Array.isArray(node.content)) return;
            node.content.forEach(node => descendants(node, `${prefix}-`));
        };
        descendants(doc as TNode, '-');
        console.log(`Image ids: ${ids}`);
        return ids;
    } catch (error) {
        console.error(`getImagesFromProse: ${error}`);
        return [];
    }
};
/**
 * Обходит узел таблицы и вычисляет ширины столбцов
 * @param node Узел таблицы
 * @returns массив ширин столбцов в процентах или пустой массив в случае ошибки
 */
export const colsWidthFromNode = (node: Node): number [] => {
    if (node.type.name !== 'table') return [];
    let cols: number[] = [];
    //console.dir(node);
    const content = node.content.content;
    // Обойдем все строки в таблице
    content.forEach(row => {
        if (row.type.name !== 'table_row') return;
        // Обойдем все столбцы в ряду
        let cnum = 0;
        row.content.content.forEach(col => {
            if (col.type.name !== 'table_header' && col.type.name !== 'table_cell') return;
            const span  = col.attrs.colspan as number;
            const width = col.attrs.colwidth as number|null;
            for (let i = 0; i < span; i ++) {
                const index = cnum + i;
                const w = width ? Math.round(width/span) : 1;
                // Ширину устанавливаем только если она еще не установлена или ячейка не объединенная
                if(!cols[index] || span === 1) cols[index] = w;
            }
            cnum += span;
        });
    });
    //console.log(`TABLE ${cols}px`);
    const sum = cols.reduce((a, b) => { return a + b }, 0);
    cols = cols.map(w => Math.round(w * 100/sum));
    const add = 100 - cols.reduce((a, b) => { return a + b }, 0);
    cols[cols.length - 1] += add;
    //console.log(`TABLE ${cols}%`);
    return cols;
};
/**
 * Обходит всю таблицу и возвращает актуальные ширины столбцов в пикселях
 * @param cell Ячейка таблицы от которой пляшем, нужна только для того чтобы найти саму таблицу
 * @returns массив ширин столбцов в пикселах или пустой массив в случае ошибки
 */
export const colsWidthFromDOM = (cell: HTMLTableCellElement): number[] => {
    //console.log('colsWidthFromDOM');
    const table = cell.parentElement?.closest('TABLE') as HTMLTableElement;
    if (!table) return [];
    let cols: number[] = [];
    for (let i = 0; i < table.rows.length; i ++) {
        const row = table.rows[i] as HTMLTableRowElement;
        let cnum = 0;
        for (let j = 0; j < row.cells.length; j ++) {
            const col = row.cells[j] as HTMLTableCellElement;
            const span  = col.colSpan;
            const width = col.clientWidth;
            for (let k = 0; k < span; k ++) {
                const index = cnum + k;
                const w = width ? Math.round(width/span) : 1;
                // Ширину устанавливаем только если она еще не установлена или ячейка не объединенная
                if(!cols[index] || span === 1) cols[index] = w;
            }
            cnum += span;
        }
    }
    return cols;
};

