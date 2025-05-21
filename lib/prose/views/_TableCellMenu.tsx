/**
 * Компонент для отображения плашек вызова меню строк и столбцов
 */
import { FC } from 'react';

type Props = {
    firstCol: boolean;
    firstRow: boolean;
    onColMenu: () => void;
    onRowMenu: () => void;
};

const TableCellMenu: FC<Props> = ({ firstCol, firstRow, onColMenu, onRowMenu }) => {

    return (<>
        {firstCol && <div className='row-menu' onClick={() => onRowMenu()}/>}
        {firstRow && <div className='col-menu' onClick={() => onColMenu()}/>}
    </>);
};

export default TableCellMenu;
