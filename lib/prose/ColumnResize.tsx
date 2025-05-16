/**
 * Замена плагину columnResizing из prosemirror-tables
 * ВНИМАНИЕ: Не закончено! Работа только начата!
 */
import { useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { cellAround, TableMap } from "prosemirror-tables";
import { EditorView } from "prosemirror-view";
import { FC, useEffect, useState } from "react";

const handleWidth = 4;
const lastColumnResizable = false;

const ColumnResize: FC = () => {
    const [ dragging, setDragging ] = useState(false);
    const [ activeHandle, setActiveHandle ] = useState<number>(-1);

    const handleMouseMove = useEditorEventCallback((view, event: MouseEvent): void => {
        if (!view || dragging) return;

        const target = domCellAround(event.target as HTMLElement);
        let cell = -1;

        if (target) {
            const { left, right } = target.getBoundingClientRect();
            if (event.clientX - left <= handleWidth)
                cell = edgeCell(view, event, 'left', handleWidth);
            else if (right - event.clientX <= handleWidth)
                cell = edgeCell(view, event, 'right', handleWidth);
        }

        if (cell != activeHandle) {
            if (!lastColumnResizable && cell !== -1) {
                const $cell = view.state.doc.resolve(cell);
                const table = $cell.node(-1);
                const map = TableMap.get(table);
                const tableStart = $cell.start(-1);
                const col = map.colCount($cell.pos - tableStart) + $cell.nodeAfter!.attrs.colspan - 1;
                if (col == map.width - 1) return;
            }
            setActiveHandle(cell);
        }
    });

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            handleMouseMove(event);
        };

        document.addEventListener('mousemove', onMouseMove);
        return () => document.removeEventListener('mousemove', onMouseMove);
    }, []);

    useEffect(() => {
        if (activeHandle === -1) return;
    }, [ activeHandle ]);


    return null;
};

/**
 * Находим ближайшую ячеку таблицы от указанного элемента
 */
const domCellAround = (target: HTMLElement | null): HTMLElement | null => {
  while (target && target.nodeName != 'TD' && target.nodeName != 'TH') {
    target = target.classList && target.classList.contains('ProseMirror') ? null : (target.parentNode as HTMLElement);
  }
  return target;
}

function edgeCell(
  view: EditorView,
  event: MouseEvent,
  side: 'left' | 'right',
  handleWidth: number,
): number {
  // posAtCoords returns inconsistent positions when cursor is moving
  // across a collapsed table border. Use an offset to adjust the
  // target viewport coordinates away from the table border.
  const offset = side == 'right' ? -handleWidth : handleWidth;
  const found = view.posAtCoords({
    left: event.clientX + offset,
    top: event.clientY,
  });
  if (!found) return -1;
  const { pos } = found;
  const $cell = cellAround(view.state.doc.resolve(pos));
  if (!$cell) return -1;
  if (side == 'right') return $cell.pos;
  const map = TableMap.get($cell.node(-1)),
    start = $cell.start(-1);
  const index = map.map.indexOf($cell.pos - start);
  return index % map.width == 0 ? -1 : start + map.map[index - 1];
}

export default ColumnResize;
