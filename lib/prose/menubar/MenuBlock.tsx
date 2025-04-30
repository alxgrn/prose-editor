/**
 * Блок кнопок в меню
 */
import { FC } from 'react';
import MenuItem, { TMenuItem } from './MenuItem';
import './MenuBlock.css';

type Props = {
    items: TMenuItem[];
};

const MenuBlock: FC<Props> = ({ items }) => (
    <div className='MenuBlock'>
        {items.map((item, index) => <MenuItem key={index} item={item}/>)}
    </div>
);

export default MenuBlock;
