/**
 * Вспомогательный компонент для изменения ширин колонок таблицы.
 * К сожалению, плагины columnResizing и tableEditing из prosemirror-tables
 * совместно не работают под react-prosemirror:
 * https://github.com/handlewithcarecollective/react-prosemirror/discussions/63
 * Поэтому пришлось изобретать свой ресайзер.
 */
import { FC, useEffect, useState } from 'react';

export const SIZE = 12; // Размер ползунка
export const BORDER_SIZE = 1; // Ширина бордера
export const MIN_WIDTH = 50; // Минимальная ширина столбца

type Props = {
    // Массив текущих ширин столбцов в пикселах
    width: number[];
    // Вызывается во время перетаскивания ползунка и нужен для отображения ширин в редакторе
    onChange: (w: number[]) => void;
    // Вызывается после завершения перетаскивания и нужен для записи новых значений в документ
    onWidth: (w: number[]) => void;
}

const TableResizer: FC<Props> = ({ width, onChange, onWidth }) => {
    const [ dragging, setDragging ] = useState(false);
    const [ startX, setStartX ] = useState(0);
    const [ current, setCurrent ] = useState(0);
    const [ innerWidth, setInnerWidth ] = useState(width);

    const calculateNewWidth = (offset: number) => {
        const currentWidth = width[current];
        const nextWidth = width[current + 1];
        const newWidth = [...innerWidth];
        if (currentWidth + offset < MIN_WIDTH) offset = MIN_WIDTH - currentWidth;
        if (nextWidth - offset < MIN_WIDTH) offset = nextWidth - MIN_WIDTH;
        newWidth[current] = currentWidth + offset;
        newWidth[current + 1] = nextWidth - offset;
        return newWidth;
    };

    useEffect(() => {
        setInnerWidth(width);
    }, [ width ]);

    useEffect(() => {
        // Конец перетаскивания
        const onMouseUp = (e: MouseEvent) => {
            if (!dragging) return;
            setDragging(false);
            e.preventDefault();
            e.stopPropagation();
            const offset = e.clientX - startX;
            const newWidth = calculateNewWidth(offset);
            //console.log(`onMouseUp: ${innerWidth}`);
            onWidth(newWidth);
        }

        // Перетаскивание
        const onMouseMove = (e: MouseEvent) => {
            if (!dragging) return;
            e.preventDefault();
            e.stopPropagation();
            const offset = e.clientX - startX;
            const newWidth = calculateNewWidth(offset);
            setInnerWidth(newWidth);
            //console.log(`${newWidth}`);
            onChange(newWidth);
        };

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        return () => {
            document.removeEventListener('mouseup', onMouseUp);
            document.removeEventListener('mousemove', onMouseMove);
        }
    }, [ dragging, current ]);

    const onMouseDown = (e: React.MouseEvent, index: number) => {
        if (index === width.length - 1) return;
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
        setStartX(e.clientX);
        setCurrent(index);
        // console.log(`onMouseDown: ${index}`);
    };

    const getLeft = (index: number): number => {
        return innerWidth.slice(0, index + 1).reduce((a,b) => a+b, 0) + index + BORDER_SIZE - SIZE/2;
    };

    return (
        <div className='table-resizer'>
            {innerWidth.map((_, index) => <div
                key={index}
                style={{left: getLeft(index) + 'px'}}
                onMouseDown={e => onMouseDown(e, index)}
            />)}
        </div>
    );
};

export default TableResizer;
