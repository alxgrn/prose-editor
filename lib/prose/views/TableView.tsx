/**
 * Кастомное отображение таблицы для реактора
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { deleteTable } from "prosemirror-tables";
import { forwardRef, useEffect, useRef, useState } from "react";
import './TableView.css';

type ColAttrs = {
    colspan: number;
    colwidth: [number]|null;
};

const TableView = forwardRef<HTMLTableElement, NodeViewComponentProps>(
    function Table({ children, nodeProps, ...props }, outerRef) {
        const tableRef = useRef<HTMLTableElement>(null);
        const [ width, setWidth ] = useState<number[]>([]);

        // Вычисляем ширины столбцов в соответствиями со значениями
        // атрибутов ячеек. Можно было бы использовать updateColumnsOnResize
        // из пакета prosemirror-tables но он рассчитывает только ширины 
        // измененных столбцов и допускает наличие [0] и null вместо ширин.
        // Тут же мы вычисляем все ширины, даже если они явно не указаны
        // в документе, и проставляем их в colgroup.
        useEffect(() => {
            if (!tableRef.current) return;
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
            const setwidth = width.reduce((a,b) => a + b, 0);
            // Узнаем число бордеров, которые вычтем из ширины
            const borders = width.length + 1;
            // Вычислим ширину для столбцов, у которых она не указана
            const defwidth = zeronum ? (tableRef.current.offsetWidth - setwidth - borders)/zeronum : 0;
            // Проставим дефолтную ширину для столбцов, у которых ширина не указана
            width = width.map(w => w ? w : defwidth);
            setWidth(width);
            // console.dir(width);
        }, [ nodeProps, tableRef ]);

/*      Для отображения ширин столбцов можно использовать функцию
        updateColumnsOnResize из пакета prosemirror-tables
        useEffect(() => {
            if (!tableRef.current || !colgroupRef.current) return;
            updateColumnsOnResize(nodeProps.node, colgroupRef.current, tableRef.current, 20);
        }, [ nodeProps, tableRef, colgroupRef ]);
*/
        // Удаление таблицы
        const onClick = useEditorEventCallback((view) => {
            deleteTable(view.state, view.dispatch);
        });

        return (
            <table
                {...props}
                ref={(el) => {
                    tableRef.current = el;
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
        );
    }
);

export default TableView;
