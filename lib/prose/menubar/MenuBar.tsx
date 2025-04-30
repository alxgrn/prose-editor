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
import { TEditorSaver, TImageUploader } from '../../types';
import './MenuBar.css';
import AlignMenu from './elements/AlignMenu';

type Props = {
    schema: Schema;
    onSave: TEditorSaver;
    onUpload: TImageUploader;
};

export const MenuBar: FC<Props> = ({ schema, onSave, onUpload }) => (
    <div className='MenuBar'>    
        <div className='MenuBlock'>
            <HeaderMenu schema={schema}/>
            <MakeBlockMenu schema={schema}/>
        </div>
        <InlineMarks schema={schema}/>
        <InsertBlocks schema={schema} onUpload={onUpload}/>
        <WrapBlockMenu schema={schema}/>
        <AlignMenu schema={schema}/>
        <BlockCommands/>
        <UndoRedo/>
        <div className='MenuBlock'>
            <SaveButton onSave={onSave}/>
        </div>
    </div>
);

export default MenuBar;
