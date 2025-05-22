/**
 * Кастомное отображение ячейки таблицы.
 * Нам необходимо отобразить плашки для вызова контекстных меню рядов и столбцов,
 * а также необходимо выводить контекстное меню ячейки.
 * Для плашек мы используем псеводоэлементы ::before и ::after у ячеек по краю таблицы.
 */
import { NodeViewComponentProps } from "@handlewithcare/react-prosemirror";
import { forwardRef, useEffect, useRef, useState } from "react";
import TableMenu from "./TableMenu";
//import TableCellResizer from "./TableCellResizer";
//import TableCellMenu from "./TableCellMenu";
//import { colsWidthFromDOM } from "../utils";

const TableCellView = forwardRef<HTMLTableCellElement, NodeViewComponentProps>(
    function TableCell({ children, nodeProps, ...props }, outerRef) {
        const innerRef = useRef<HTMLTableCellElement>(null);
        //const [ firstCol, setFirstCol ] = useState(false);
        //const [ firstRow, setFirstRow ] = useState(false);
        const [ isRowMenuOpen, setIsRowMenuOpen ] = useState(false);
        const [ isCellMenuOpen, setIsCellMenuOpen ] = useState(false);
        const [ isColumnMenuOpen, setIsColumnMenuOpen ] = useState(false);
        //const [ isResizible, setIsResizible ] = useState(false);

        // Для отладки изменения размеров ячейки
        //useStopEvent((view, event) => {
        //    if (!view) return false;
        //    return (event instanceof MouseEvent);
        //});

        // Закрываем свое контекстное меню при вызове контекстного меню вне себя
        useEffect(() => {
            const handler = (e: globalThis.MouseEvent) => {
                if(innerRef.current !== e.target) {
                    setIsRowMenuOpen(false);
                    setIsCellMenuOpen(false);
                    setIsColumnMenuOpen(false);
                }
            };

            document.addEventListener('contextmenu', handler, true);
            return () => document.removeEventListener('contextmenu', handler, true);
        }, []);

        // Узнаем надо или нет размещать ползунок для изменения ширины ячейки
        /*
        useEffect(() => {
            const cell = innerRef.current;
            const row = cell?.parentNode;
            const tbody = row?.parentNode;
            if (!cell || !row || !tbody) return;
            setIsResizible(row.lastChild !== cell);
            setIsResizible(false); // пока выключим
            setFirstCol(row.firstChild === cell);
            setFirstRow(Array.from(tbody.children)[0] === row);

        }, [ innerRef ]);
        */
        // Показывает контекстное меню ячейки.
        // Используем для вызова контекстного меню столбцов и рядов ::before и
        // ::after управляющих ячеек. Поэтому для определения какое именно меню
        // надо показать используем проверку на место клика вне самой ячейки.
        const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsRowMenuOpen(false);
            setIsCellMenuOpen(false);
            setIsColumnMenuOpen(false);
            const rect = e.currentTarget.getBoundingClientRect();
            if (e.clientY < rect.y) {
                setIsColumnMenuOpen(true);
            } else if (e.clientX < rect.x) {
                setIsRowMenuOpen(true);
            } else {
                setIsCellMenuOpen(true);
            }
        };

        // По клику открываем только меню рядов и столбцов
        const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
            setIsRowMenuOpen(false);
            setIsCellMenuOpen(false);
            setIsColumnMenuOpen(false);
            const rect = e.currentTarget.getBoundingClientRect();
            if (e.clientY < rect.y) {
                setIsColumnMenuOpen(true);
            } else if (e.clientX < rect.x) {
                setIsRowMenuOpen(true);
            } else {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
        };

        // Если надо отобразить заголовок выводим тег TH...
        if (nodeProps.node.type.spec.tableRole === 'header_cell') return (
            <th {...props}
                datatype={`width-${nodeProps.node.attrs.colwidth}`}
                colSpan={nodeProps.node.attrs.colspan}
                rowSpan={nodeProps.node.attrs.rowspan}
                style={{
                    textAlign: nodeProps.node.attrs.halign,
                    verticalAlign: nodeProps.node.attrs.valign,
                }}
                onClick={onClick}
                onContextMenu={onContextMenu}
                ref={(el) => {
                    innerRef.current = el;
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
                {children}
                {/*
                <TableCellMenu
                    firstCol={firstCol}
                    firstRow={firstRow}
                    onColMenu={() => setIsColumnMenuOpen(true)}
                    onRowMenu={() => setIsRowMenuOpen(true)}
                />
                <TableCellResizer
                    parent={innerRef.current}
                    isResizible={isResizible}
                    node={nodeProps.node}
                    pos={nodeProps.getPos()}
                />
                */}
                <TableMenu
                    parent={innerRef.current}
                    isRowMenuOpen={isRowMenuOpen}
                    onRowMenuClose={() => setIsRowMenuOpen(false)}
                    isCellMenuOpen={isCellMenuOpen}
                    onCellMenuClose={() => setIsCellMenuOpen(false)}
                    isColumnMenuOpen={isColumnMenuOpen}
                    onColumnMenuClose={() => setIsColumnMenuOpen(false)}
                />
            </th>
        );

        // ...в противном случае выводим тег TD
        return (
            <td {...props}
                datatype={`width-${nodeProps.node.attrs.colwidth}`}
                colSpan={nodeProps.node.attrs.colspan}
                rowSpan={nodeProps.node.attrs.rowspan}
                style={{
                    textAlign: nodeProps.node.attrs.halign,
                    verticalAlign: nodeProps.node.attrs.valign,
                }}
                onClick={onClick}
                onContextMenu={onContextMenu}
                ref={(el) => {
                    innerRef.current = el;
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
                {children}
                {/*
                <TableCellMenu
                    firstCol={firstCol}
                    firstRow={firstRow}
                    onColMenu={() => setIsColumnMenuOpen(true)}
                    onRowMenu={() => setIsRowMenuOpen(true)}
                />
                <TableCellResizer
                    parent={innerRef.current}
                    isResizible={isResizible}
                    node={nodeProps.node}
                    pos={nodeProps.getPos()}
                />
                */}
                <TableMenu
                    parent={innerRef.current}
                    isRowMenuOpen={isRowMenuOpen}
                    onRowMenuClose={() => setIsRowMenuOpen(false)}
                    isCellMenuOpen={isCellMenuOpen}
                    onCellMenuClose={() => setIsCellMenuOpen(false)}
                    isColumnMenuOpen={isColumnMenuOpen}
                    onColumnMenuClose={() => setIsColumnMenuOpen(false)}
                />
            </td>
        );
    }
);

export default TableCellView;
