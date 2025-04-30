import { FC } from 'react';
import { Schema } from "prosemirror-model";
import MakeBlockMenu from './elements/MakeBlockMenu';
import InlineMarks from './elements/InlineMarks';
import UndoRedo from './elements/UndoRedo';
import WrapBlockMenu from './elements/WrapBlockMenu';
import InsertBlocks from './elements/InsertBlocks';
import { TImageUploader } from '../../types';
import BlockCommands from './elements/BlockCommands';
import './SimpleMenuBar.css';

type Props = {
    schema: Schema;
    onUpload?: TImageUploader;
};

export const SimpleMenuBar: FC<Props> = ({ schema, onUpload }) => (
    <div className='SimpleMenuBar'>    
        <div className='MenuBlock'>
            <MakeBlockMenu schema={schema}/>
        </div>
        <InlineMarks schema={schema}/>
        <InsertBlocks schema={schema} onUpload={onUpload}/>
        <WrapBlockMenu schema={schema}/>
        <BlockCommands/>
        <UndoRedo/>
    </div>
);

export default SimpleMenuBar;
