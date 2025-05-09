/**
 * Кастомное отображение таблицы для реактора
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { deleteTable, updateColumnsOnResize } from "prosemirror-tables";
import { forwardRef, useEffect, useRef } from "react";
import './TableView.css';

const TableView = forwardRef<HTMLTableElement, NodeViewComponentProps>(
    function Table({ children, nodeProps, ...props }, outerRef) {
        const tableRef = useRef<HTMLTableElement>(null);
        const colgroupRef = useRef<HTMLTableColElement>(null);
        // Функция updateColumnsOnResize вычисляет размеры и расставляет
        // размеры ячеек таблицы при их изменении через плагин columnResizing
        // из пакета prosemirror-tables
        // Пока мы этот плагин не используем т.к. его работа нестабильна и
        // периодически приводит к ошибке. Необходимо разбираться почему.
        useEffect(() => {
            if (!tableRef.current || !colgroupRef.current) return;
            updateColumnsOnResize(nodeProps.node, colgroupRef.current, tableRef.current, 20);
        }, [ nodeProps, tableRef, colgroupRef ]);

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
                <colgroup ref={colgroupRef}/>
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
