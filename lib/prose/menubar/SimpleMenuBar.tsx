import { FC } from 'react';
import { Schema } from "prosemirror-model";
import MakeBlockMenu from './elements/MakeBlockMenu';
import InlineMarks from './elements/InlineMarks';
import UndoRedo from './elements/UndoRedo';
import WrapBlockMenu from './elements/WrapBlockMenu';
import InsertBlocks from './elements/InsertBlocks';
import BlockCommands from './elements/BlockCommands';
import './SimpleMenuBar.css';

type Props = {
    schema: Schema;
};

export const SimpleMenuBar: FC<Props> = ({ schema }) => (
    <div className='SimpleMenuBar'>    
        <div className='MenuBlock'>
            <MakeBlockMenu schema={schema}/>
        </div>
        <InlineMarks schema={schema}/>
        <InsertBlocks schema={schema}/>
        <WrapBlockMenu schema={schema}/>
        <BlockCommands schema={schema}/>
        <UndoRedo/>
    </div>
);

export default SimpleMenuBar;
