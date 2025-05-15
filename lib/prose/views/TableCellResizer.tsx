/**
 * Вспомогательный компонент для изменения ширины ячейки таблицы.
 * К сожалению, плагины columnResizing и tableEditing из prosemirror-tables
 * совместно не работают под react-prosemirror:
 * https://github.com/handlewithcarecollective/react-prosemirror/discussions/63
 * Поэтому пришлось изобретать свой ресайзер для колонок.
 * Он визуально не очень комфортный т.к. ведет себя не так, как привычно для
 * пользователя. Необходимо будет переделать.
 */
import { FC, useEffect, useRef, useState } from "react";
import { Node } from "prosemirror-model";
import { useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { TableMap } from "prosemirror-tables";
import './TableCellResizer.css';

const MIN_CELL_WIDTH = 20;

type Attrs = {
    readonly [attr: string]: any;
};

interface CellAttrs {
    colspan: number;
    rowspan: number;
    colwidth: number[] | null;
};

type Props = {
    parent?: HTMLTableCellElement|null;
    isResizible?: boolean;
    node: Node;
    pos: number;
}

const TableCellResizer: FC<Props> = ({ parent, isResizible, node, pos }) => {
    const ref = useRef(null);
    const [ dragging, setDragging ] = useState(false);
    const [ startX, setStartX ] = useState(0);
    const [ left, setLeft ] = useState(0);
    const [ startLeft, setStartLeft ] = useState(0);
    const [ startWidth, setStartWidth ] = useState(MIN_CELL_WIDTH);

    // Копия функции из prosemirror-tables/src/columnresizing.ts
    const currentColWidth = useEditorEventCallback((view, cellPos: number, { colspan, colwidth }: Attrs): number => {
        const width = colwidth && colwidth[colwidth.length - 1];
        if (width) return width;
        const dom = view.domAtPos(cellPos);
        const node = dom.node.childNodes[dom.offset] as HTMLElement;
        let domWidth = node.offsetWidth;
        let parts = colspan;
        if (colwidth) {
            for (let i = 0; i < colspan; i++) {
                if (colwidth[i]) {
                    domWidth -= colwidth[i];
                    parts--;
                }
            }
        }
        return domWidth / parts;
    });

    // Копия функции из prosemirror-tables/src/columnresizing.ts
    const updateColumnWidth = useEditorEventCallback((view, width: number) => {
        if (!view) return;
        const $cell = view.state.doc.resolve(pos);
        const table = $cell.node(-1);
        const map = TableMap.get(table);
        const start = $cell.start(-1);
        // Текущий столбец невзирая на colspan (номер последнего столбца в colspan)
        const col = map.colCount($cell.pos - start) + $cell.nodeAfter!.attrs.colspan - 1;
        const tr = view.state.tr;
        // Обходим все строки и в каждой ячейке нужного столбца меняем ширину
        for (let row = 0; row < map.height; row ++) {
            const mapIndex = row * map.width + col; // Индекс ячейки в массиве ячеек
            // Если ячейка была в составе rowspan, то её не нужно обрабатывать повторно
            if (row && map.map[mapIndex] == map.map[mapIndex - map.width]) continue;
            const pos = map.map[mapIndex];
            const attrs = table.nodeAt(pos)!.attrs as CellAttrs;
            const index = attrs.colspan == 1 ? 0 : col - map.colCount(pos);
            if (attrs.colwidth && attrs.colwidth[index] == width) continue;
            const colwidth = attrs.colwidth ? attrs.colwidth.slice() : Array(attrs.colspan).fill(0); // zeroes(attrs.colspan);
            colwidth[index] = width;
            tr.setNodeMarkup(start + pos, null, { ...attrs, colwidth: colwidth });
        }
        if (tr.docChanged) view.dispatch(tr);
    });

    // Конец перетаскивания
    useEffect(() => {
        const onMouseUp = (e: MouseEvent) => {
            if (!dragging) return;
            setDragging(false);
            e.preventDefault();
            e.stopPropagation();
            const offset = e.clientX - startX;
            updateColumnWidth(Math.max(startWidth + offset, MIN_CELL_WIDTH));
        }
        document.addEventListener('mouseup', onMouseUp);
        return () => document.removeEventListener('mouseup', onMouseUp);
    }, [ dragging ]);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            e.preventDefault();
            e.stopPropagation();
            const offset = e.clientX - startX;
            //console.log(`offset: ${offset}, left: ${startLeft + offset}`)
            setLeft(startLeft + offset);
        };

        document.addEventListener('mousemove', onMouseMove);
        return () => document.removeEventListener('mousemove', onMouseMove);
    }, [ dragging ]);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!ref.current) return;
        e.preventDefault();
        e.stopPropagation();
        const left = window.getComputedStyle(ref.current).getPropertyValue('left');
        setDragging(true);
        setStartX(e.clientX);
        setStartLeft(parseInt(left));
        setStartWidth(currentColWidth(pos, node.attrs));
    };

    if (!parent || !isResizible) return null;

    return <div
        ref={ref} 
        className={`ProseMirror-cell-resizer ${dragging ? 'dragging' : ''}`}
        onMouseDown={onMouseDown}
        style={left ? { left } : undefined}
    />;
};

export default TableCellResizer;
