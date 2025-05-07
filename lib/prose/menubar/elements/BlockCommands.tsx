/**
 * Кнопки манипуляций блоками
 */
import { FC } from 'react';
import MenuBlock from '../MenuBlock';
import { joinUp, lift, selectParentNode } from "prosemirror-commands";
import { Icons } from '@alxgrn/telefrag-ui';
import { Schema } from "prosemirror-model";

type Props = {
    schema: Schema;
};

export const BlockCommands: FC<Props> = ({ schema }) => {
    // Карусель есть только в большой схеме
    if (schema.nodes.carousel) return (
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
    // В упрощенном редакторе склейку блоков не показываем
    return (
        <MenuBlock items={[{
            icon: <Icons.IndentDecrease/>,
            command: lift,
        },{
            icon: <Icons.SquareDashed/>,
            command: selectParentNode,
        }]} />
    );
};

export default BlockCommands;
