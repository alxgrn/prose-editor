/**
 * Контекстные меню ячейки таблицы
 */
import { Icons, Menu, MenuItem } from "@alxgrn/telefrag-ui";
import { useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { addColumnAfter, addColumnBefore, addRowAfter, addRowBefore, deleteColumn, deleteRow, mergeCells, setCellAttr, splitCell, toggleHeaderCell, toggleHeaderColumn, toggleHeaderRow } from "prosemirror-tables";
import { FC } from "react";

// Контекстное меню ряда
const rowMenuItems: MenuItem[] = [{
    id: 'toggleHeaderRow',
    text: 'Toggle header row',
    icon: <Icons.Heading/>,
},{
    id: 'addRowBefore',
    text: 'Insert row before',
    icon: <Icons.RowInsertBefore/>,
},{
    id: 'addRowAfter',
    text: 'Insert row after',
    icon: <Icons.RowInsertAfter/>,
},{
    id: 'deleteRow',
    text: 'Delete row',
    icon: <Icons.Trash/>,
}];
// Контекстное меню столбца
const columnMenuItems: MenuItem[] = [{
    id: 'toggleHeaderColumn',
    text: 'Toggle header column',
    icon: <Icons.Heading/>,
},{
    id: 'addColumnBefore',
    text: 'Insert column before',
    icon: <Icons.ColumnInsertBefore/>,
},{
    id: 'addColumnAfter',
    text: 'Insert column after',
    icon: <Icons.ColumnInsertAfter/>,
},{
    id: 'deleteColumn',
    text: 'Delete column',
    icon: <Icons.Trash/>,
}];
// Контекстное меню ячейки
const cellMenuItems: MenuItem[] = [{
    id: 'toggleHeaderCell',
    text: 'Toggle header',
    icon: <Icons.Heading/>,
},{
    id: 'alignLeft',
    text: 'Horizontal align left',
    icon: <Icons.AlignLeft/>
},{
    id: 'alignCenter',
    text: 'Horizontal align center',
    icon: <Icons.AlignCenter/>,
},{
    id: 'alignRight',
    text: 'Horizontal align Right',
    icon: <Icons.AlignRight/>,
},{
    id: 'alignTop',
    text: 'Vertical align top',
    icon: <Icons.AlignTop/>,
},{
    id: 'alignMiddle',
    text: 'Vertical align middle',
    icon: <Icons.AlignMiddle/>,
},{
    id: 'alignBottom',
    text: 'Vertical align bottom',
    icon: <Icons.AlignBottom/>,
},{
    id: 'mergeCells',
    text: 'Merge cells',
    icon: <Icons.CellsMerge/>,
},{
    id: 'splitCell',
    text: 'Split cell',
    icon: <Icons.CellsSplit/>,
}];

type Props = {
    parent?: HTMLElement | null;
    isRowMenuOpen: boolean;
    isCellMenuOpen: boolean;
    isColumnMenuOpen: boolean;
    onRowMenuClose: () => void;
    onCellMenuClose: () => void;
    onColumnMenuClose: () => void;
};


const TableCellMenu: FC<Props> = ({ parent,
                                    isRowMenuOpen, isCellMenuOpen, isColumnMenuOpen,
                                    onRowMenuClose, onCellMenuClose, onColumnMenuClose }) => {
    const onMenuClick = useEditorEventCallback((view, item: MenuItem) => {
        if (!view) return;

        switch (item.id) {
            case 'toggleHeaderRow':
                toggleHeaderRow(view.state, view.dispatch);
                break;
            case 'addRowBefore':
                addRowBefore(view.state, view.dispatch);
                break;
            case 'addRowAfter':
                addRowAfter(view.state, view.dispatch);
                break;
            case 'deleteRow':
                deleteRow(view.state, view.dispatch);
                break;
            case 'toggleHeaderColumn':
                toggleHeaderColumn(view.state, view.dispatch);
                break;
            case 'addColumnBefore':
                addColumnBefore(view.state, view.dispatch);
                break;
            case 'addColumnAfter':
                addColumnAfter(view.state, view.dispatch);
                break;
            case 'deleteColumn':
                deleteColumn(view.state, view.dispatch);
                break;
            case 'mergeCells':
                mergeCells(view.state, view.dispatch);
                break;
            case 'splitCell':
                splitCell(view.state, view.dispatch);
                break;
            case 'toggleHeaderCell':
                toggleHeaderCell(view.state, view.dispatch);
                break;
            case 'alignLeft':
                setCellAttr('halign', 'left')(view.state, view.dispatch);
                break;
            case 'alignCenter':
                setCellAttr('halign', 'center')(view.state, view.dispatch);
                break;
            case 'alignRight':
                setCellAttr('halign', 'right')(view.state, view.dispatch);
                break;
            case 'alignTop':
                setCellAttr('valign', 'top')(view.state, view.dispatch);
                break;
            case 'alignMiddle':
                setCellAttr('valign', 'middle')(view.state, view.dispatch);
                break;
            case 'alignBottom':
                setCellAttr('valign', 'bottom')(view.state, view.dispatch);
                break;
            default:
                break;
        }

        onRowMenuClose();
        onCellMenuClose();
        onColumnMenuClose();
        view.focus();
    });

    if (!parent) return null;

    return (<>
        <Menu
            parent={parent}
            items={rowMenuItems}
            isOpen={isRowMenuOpen}
            onClose={onRowMenuClose}
            onClick={onMenuClick}
            vertical='top'
            horizontal='inner-left'
        />
        <Menu
            parent={parent}
            items={cellMenuItems}
            isOpen={isCellMenuOpen}
            onClose={onCellMenuClose}
            onClick={onMenuClick}
            horizontal='inner-left'
        />
        <Menu
            parent={parent}
            items={columnMenuItems}
            isOpen={isColumnMenuOpen}
            onClose={onColumnMenuClose}
            onClick={onMenuClick}
            vertical='top'
            horizontal='inner-left'
            margin='var(--alxgrn-unit)'
        />
    </>);
};

export default TableCellMenu;
