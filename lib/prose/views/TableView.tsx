/**
 * Кастомное отображение таблицы для реактора
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { deleteTable, TableMap } from "prosemirror-tables";
import { forwardRef, useEffect, useRef, useState } from "react";
import TableResizer from "./TableResizer";
import { BORDER_SIZE, MIN_WIDTH } from "./TableResizer";
import './TableView.css';

type CellAttrs = {
    colspan: number;
    rowspan: number;
    colwidth: number[] | null;
};

type ColAttrs = {
    colspan: number;
    colwidth: [number]|null;
};

const TableView = forwardRef<HTMLDivElement, NodeViewComponentProps>(
    function Table({ children, nodeProps, ...props }, outerRef) {
        const tableRef = useRef<HTMLTableElement>(null);
        const wrapperRef = useRef<HTMLDivElement>(null);
        const [ width, setWidth ] = useState<number[]>([]);

        const onWidth = useEditorEventCallback((view, width: number[]) => {
            if (!view) return;
            const table = nodeProps.node;
            const start = nodeProps.getPos() + 1;
            const map = TableMap.get(table);
            const tr = view.state.tr;
            // console.log(`pos=${nodeProps.getPos()} start=${start}`)
            // Обходим все строки и в каждой ячейке меняем ширину
            for (let row = 0; row < map.height; row ++) {
                for (let col = 0; col < map.width;) {
                    const mapIndex = row * map.width + col; // Индекс ячейки в массиве ячеек
                    const pos = map.map[mapIndex]; // Позиция ячейки относительно начала таблицы
                    const attrs = table.nodeAt(pos)!.attrs as CellAttrs;
                    const colwidth = width.slice(col, col + attrs.colspan);
                    // Если ячейка была в составе rowspan, то её не нужно обрабатывать повторно
                    if (!(row && map.map[mapIndex] == map.map[mapIndex - map.width])) {
                        tr.setNodeMarkup(start + pos, null, { ...attrs, colwidth });
                        //console.log(`[${row},${col}][${attrs.colspan}] - ${colwidth.join()} - ${colwidth.length}`)
                    }
                    col += attrs.colspan;
                }
            }
            if (tr.docChanged) view.dispatch(tr);
        });

        // Вычисляем ширины столбцов в соответствиями со значениями
        // атрибутов ячеек. Можно было бы использовать updateColumnsOnResize
        // из пакета prosemirror-tables но он рассчитывает только ширины 
        // измененных столбцов и допускает наличие [0] и null вместо ширин.
        // Тут же мы вычисляем все ширины, даже если они явно не указаны
        // в документе, и проставляем их в colgroup.
        useEffect(() => {
            if (!tableRef.current || !wrapperRef.current) return;
            const table = nodeProps.node;
            const row = table.firstChild;
            if (!row) return;
            let width: number[] = [];
            for (let i = 0; i < row.childCount; i ++) {
                const col = row.child(i);
                const { colspan, colwidth } = col.attrs as ColAttrs;
                width = width.concat(Array.isArray(colwidth) ? colwidth : Array(colspan).fill(0));
                // console.log(`i=${i} colspan=${colspan} colwidth=${colwidth}`);
            }
            // Узнаем у скольких столбцов не установлена ширина
            const zeronum = width.filter(w => !w).length;
            // Подсчитаем общую ширину установленных столбцов
            const setwidth = width.reduce((a, b) => a + b, 0);
            // Узнаем общую ширину бордеров, которые вычтем из ширины таблицы
            const borders = (width.length + 1) * BORDER_SIZE;
            // Вычислим ширину для столбцов, у которых она не указана
            const defwidth = Math.max(zeronum ? (tableRef.current.offsetWidth - setwidth - borders)/zeronum : 0, MIN_WIDTH);
            // Проставим дефолтную ширину для столбцов, у которых ширина не указана
            width = width.map(w => w ? w : defwidth);
            // Общая ширина столбцов может оказаться больше максимально допустимой ширины таблицы.
            // Это может случиться из-за разного размера экрана редактора в разных клиентах.
            // Поэтому нам необходимо пересчитать ширины пропорционально реальной ширине редактора.
            // В качестве такой ширины мы будем использовать ширину враппера т.к. таблица может вылезать за его пределы.
            // Стоит иметь в виду то, что в результате пересчета минимальный размер столбца может
            // стать меньше установленного в константе MIN_WIDTH. Потенциально это может приводить
            // к проблемам при большом числе столбцов на узком экране.
            const fullWidth = width.reduce((a, b) => a + b, 0);
            const wrapperWidth = wrapperRef.current.offsetWidth - borders - 16; // 16px - отступ слева для плашек меню рядов
            const scale = wrapperWidth/fullWidth;
            width = width.map(w => Math.round(w * scale));
            // Из-за округления может накапливаться ошибка, которую мы пофиксим в последнем столбце
            width[width.length - 1] += wrapperWidth - width.reduce((a, b) => a + b, 0);
            setWidth(width);
            // console.dir(width);
            // Мы пересчитали ширины столбцов и установили их через colspan в редакторе.
            // Но в самом документе остались те цифры, исходя из которых мы высчитывали свои значения.
            // Было бы хорошо записать реальные значения в сам документ. Однако если мы будем делать
            // это тут, то попадем в бесконечный цикл вызова useEffect.
            // На самом деле нам это и не надо здесь делать. Будем перезаписывать таблицу только в
            // случае изменения размера столбцов.
        }, [ nodeProps, tableRef, wrapperRef, wrapperRef.current?.offsetWidth ]);
/*      
        Для отображения ширин столбцов можно использовать функцию
        updateColumnsOnResize из пакета prosemirror-tables но есть нюансы! См. выше.
        useEffect(() => {
            if (!tableRef.current || !colgroupRef.current) return;
            updateColumnsOnResize(nodeProps.node, colgroupRef.current, tableRef.current, 20);
        }, [ nodeProps, tableRef, colgroupRef ]);
*/
        // Удаление таблицы
        const onClick = useEditorEventCallback((view) => {
            deleteTable(view.state, view.dispatch);
        });

        return (<div
            {...props}
            className='table-wrapper'
            ref={(el) => {
                wrapperRef.current = el;
                if (!outerRef) {
                    return;
                }
                if (typeof outerRef === "function") {
                    outerRef(el);
                } else {
                    outerRef.current = el;
                }
            }}
        >
            <TableResizer width={width} onChange={setWidth} onWidth={onWidth}/>
            <table ref={tableRef}>
                <colgroup>
                    {width.map((w, k) => <col key={k} width={w}/>)}
                </colgroup>
                <caption onClick={onClick}>
                    <Icons.Trash/>
                </caption>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>);
    }
);

export default TableView;
