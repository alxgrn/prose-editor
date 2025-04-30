/**
 * Вспомогательный компонент для изменения ширины ячейки таблицы
 */
import { FC, useEffect, useState } from "react";
import './TableCellResizer.css';
import { colsWidthFromDOM } from "../utils";

type Props = {
    parent?: HTMLTableCellElement|null;
    isResizible?: boolean;
    onWidth?: (width: number) => void; // вызывается при перетаскивании
}

const TableCellResizer: FC<Props> = ({ parent, isResizible, onWidth }) => {
    const [ dragging, setDragging ] = useState(false);
    const [ startX, setStartX ] = useState(0);

    useEffect(() => {
        const onMouseUp = () => {
            setDragging(false);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragging || !parent || !onWidth) return;
            e.preventDefault();
            e.stopPropagation();
            // Отправляем на сколько пикселов надо изменить текущую ширину
            onWidth(e.screenX - startX);
            const cols = colsWidthFromDOM(parent);
            console.log(`COLS: ${cols} px`);
        };

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);

        return () => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        }
    }, [ parent, dragging, onWidth ]);

    const onMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
        setStartX(e.screenX);
    };

    if (!parent || !isResizible || !onWidth) return null;

    return <div 
        className={`ProseMirror-cell-resizer ${dragging ? 'dragging' : ''}`}
        onMouseDown={onMouseDown}
    />;
};

export default TableCellResizer;
