/**
 * Кнопки манипуляций блоками
 */
import { FC } from 'react';
import MenuBlock from '../MenuBlock';
import { joinUp, lift, selectParentNode } from "prosemirror-commands";
import { Icons } from '@alxgrn/telefrag-ui';

export const BlockCommands: FC= () => (
    <MenuBlock items={[{
        icon: <Icons.JoinUp/>,
        command: joinUp,
    },{
        icon: <Icons.IndentDecrease/>,
        command: lift,
    },{
        icon: <Icons.SquareDashed/>,
        command: selectParentNode,
    }]} />
);

export default BlockCommands;
