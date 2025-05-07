import { FC } from 'react';
import { Schema } from "prosemirror-model";
import HeaderMenu from './elements/HeaderMenu';
import MakeBlockMenu from './elements/MakeBlockMenu';
import InlineMarks from './elements/InlineMarks';
import UndoRedo from './elements/UndoRedo';
import WrapBlockMenu from './elements/WrapBlockMenu';
import InsertBlocks from './elements/InsertBlocks';
import BlockCommands from './elements/BlockCommands';
import SaveButton from './elements/SaveButton';
import { TEditorSaver } from '../../types';
import './MenuBar.css';
import AlignMenu from './elements/AlignMenu';

type Props = {
    schema: Schema;
    onSave: TEditorSaver;
};

export const MenuBar: FC<Props> = ({ schema, onSave }) => (
    <div className='MenuBar'>    
        <div className='MenuBlock'>
            <HeaderMenu schema={schema}/>
            <MakeBlockMenu schema={schema}/>
        </div>
        <InlineMarks schema={schema}/>
        <InsertBlocks schema={schema}/>
        <WrapBlockMenu schema={schema}/>
        <AlignMenu schema={schema}/>
        <BlockCommands schema={schema}/>
        <UndoRedo/>
        <div className='MenuBlock'>
            <SaveButton onSave={onSave}/>
        </div>
    </div>
);

export default MenuBar;
