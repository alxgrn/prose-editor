/**
 * Блок кнопок оформления блоков текста в списки и квотинг
 */
import { FC, useEffect, useState } from 'react';
import MenuBlock from '../MenuBlock';
import { Schema } from "prosemirror-model";
import { wrapIn } from "prosemirror-commands";
import { TMenuItem } from '../MenuItem';
import { Icons } from '@alxgrn/telefrag-ui';
import { wrapInList } from 'prosemirror-schema-list';

type Props = {
    schema: Schema;
};

export const WrapBlockMenu: FC<Props> = ({ schema }) => {
    const [ items, setItems ] = useState<TMenuItem[]>([]);

    // Определим какие кнопки нужны в меню
    useEffect(() => {
        const wrap: TMenuItem[] = [];

        if (schema.nodes.bullet_list) {
            const node = schema.nodes.bullet_list;
            wrap.push({
                icon: <Icons.List/>,
                command: (s, d) => wrapInList(node)(s, d),
                //isSelected: (s) => wrapInList(node)(s),
            });
        }
    
        if (schema.nodes.ordered_list) {
            const node = schema.nodes.ordered_list;
            wrap.push({
                icon: <Icons.ListOrdered/>,
                command: (s, d) => wrapInList(node)(s, d),
                //isSelected: (s) => wrapInList(node)(s),
            });
        }
        
        if (schema.nodes.blockquote) {
            const node = schema.nodes.blockquote;
            wrap.push({
                icon: <Icons.Quote/>,
                command: (s, d) => wrapIn(node)(s, d),
                //isSelected: (s) => wrapIn(node)(s),
            });
        }    

        setItems(wrap);
    }, [ schema ]);

    if (items.length < 1) return null;
    return (<MenuBlock items={items} />);
};

export default WrapBlockMenu;
