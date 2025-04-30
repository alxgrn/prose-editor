/**
 * Кастомное отображение таблицы для реактора
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { NodeViewComponentProps, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { deleteTable } from "prosemirror-tables";
import { forwardRef, useEffect, useState } from "react";
import { colsWidthFromNode } from "../../utils/utils";
import './TableView.css';

const TableView = forwardRef<HTMLTableElement, NodeViewComponentProps>(
    function Table({ children, nodeProps, ...props }, outerRef) {
        const [ width, setWidth ] = useState<number[]>([]);

        useEffect(() => {
            setWidth(colsWidthFromNode(nodeProps.node));
        }, [ nodeProps ]);

        const onClick = useEditorEventCallback((view) => {
            deleteTable(view.state, view.dispatch);
        });

        return (
            <table ref={outerRef} {...props}>
                <colgroup>
                    {width.map((w, i) => <col key={i} style={{width: `${w}%`}}/>)}
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
