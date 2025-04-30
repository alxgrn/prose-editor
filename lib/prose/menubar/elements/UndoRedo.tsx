/**
 * Блок Undo/Redo
 */
import { FC } from 'react';
import { undo, redo } from 'prosemirror-history';
import { Icons } from '@alxgrn/telefrag-ui';
import MenuItem from '../MenuItem';

const UndoRedo: FC = () => (
    <div className='MenuBlock'>
        <MenuItem item={{
            icon: <Icons.Undo/>,
            command: undo,
        }}/>
        <MenuItem item={{
            icon: <Icons.Redo/>,
            command: redo,
        }}/>
    </div>
);

export default UndoRedo;
