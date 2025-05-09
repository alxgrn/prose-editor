/**
 * Кастомное отображение ячейки таблицы.
 * Нам необходимо отобразить плашки для вызова контекстных меню рядов и столбцов,
 * а также необходимо выводить контекстное меню ячейки.
 * Для плашек мы используем псеводоэлементы ::before и ::after у ячеек по краю таблицы.
 */
import { NodeViewComponentProps } from "@handlewithcare/react-prosemirror";
import { forwardRef, useEffect, useRef, useState } from "react";
import TableCellMenu from "./TableCellMenu";
import TableCellResizer from "./TableCellResizer";
//import { colsWidthFromDOM } from "../utils";

const TableCellView = forwardRef<HTMLTableCellElement, NodeViewComponentProps>(
    function TableCell({ children, nodeProps, ...props }, outerRef) {
        const innerRef = useRef<HTMLTableCellElement>(null);
        const [ isRowMenuOpen, setIsRowMenuOpen ] = useState(false);
        const [ isCellMenuOpen, setIsCellMenuOpen ] = useState(false);
        const [ isColumnMenuOpen, setIsColumnMenuOpen ] = useState(false);
        const [ isResizible, setIsResizible ] = useState(false);
        const [ width, setWidth ] = useState<number>();

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
        useEffect(() => {
            const node = innerRef.current;
            if (!node || !node.parentNode) return;
            const number = Array.prototype.indexOf.call(node.parentNode.children, node);
            setIsResizible(number < node.parentNode.children.length - 1);
            setIsResizible(false); // пока выключим
        }, [ innerRef ]);

        // Показываем контекстное
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

        const onWidth = (width: number) => {
            setWidth(width);
            //if (innerRef.current) colsWidthFromDOM(innerRef.current);
            //console.log(`width: ${width}`);
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
                <TableCellResizer
                    parent={innerRef.current}
                    isResizible={isResizible}
                    onWidth={onWidth}
                />
                <TableCellMenu
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
                datatype={`width-${width}`}
                colSpan={nodeProps.node.attrs.colspan}
                rowSpan={nodeProps.node.attrs.rowspan}
                style={{
                    textAlign: nodeProps.node.attrs.halign,
                    verticalAlign: nodeProps.node.attrs.valign,
                }}
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
                <TableCellResizer
                    parent={innerRef.current}
                    isResizible={isResizible}
                    onWidth={onWidth}
                />
                <TableCellMenu
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
