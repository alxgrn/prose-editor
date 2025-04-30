/**
 * Меню выбора оформления блока в виде заголовка
 */
import { Icons, Menu } from "@alxgrn/telefrag-ui";
import { MenuAlternative, MenuItem as UIMenuItem } from "@alxgrn/telefrag-ui/dist/components/ui/menu/Menu";
import { useEditorEffect, useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { Command } from "prosemirror-state";
import { FC, useRef, useState } from "react";
import { Schema } from "prosemirror-model";
import { setBlockType } from "prosemirror-commands";

type Props = {
    schema: Schema;
};

const HeaderMenu: FC<Props> = ({ schema }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ items, setItems ] = useState<MenuAlternative[]>([]);
    const [ commands, setCommands ] = useState<Command[]>([]);
    const [ isOpen, setIsOpen ] = useState(false);

    useEditorEffect((view) => {
        const nodeType = schema.nodes.heading;
        if (!view || !nodeType || !isOpen) return;
        const items: MenuAlternative[] = [];
        const commands: Command[] = [];

        for (let i = 2; i < 7; i ++) {
            const attrs = { level: i };
            const command = setBlockType(nodeType, attrs);
            commands[i] = command;

            items[i] = {
                id: i,
                icon: <Icon level={i}/>,
                text: `уровень ${i}`,
                disabled: !command(view.state),
            };
/*
            Определение того активен  блок или нет смотри blockTypeItem() тут
            https://github.com/ProseMirror/prosemirror-menu/blob/master/src/menu.ts
            Нам сейчас это не нужно, но вдруг понадобится когда-нибудь потом

            active(state) {
                let {$from, to, node} = state.selection as NodeSelection
                if (node) return node.hasMarkup(nodeType, options.attrs)
                return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs)
            }
*/                
        }

        setItems(items);
        setCommands(commands);
    }, [ isOpen ]);

    const onClick = useEditorEventCallback((view, item: UIMenuItem) => {
            if (!view || !item.id) return;
            commands[item.id as number](view.state, view.dispatch, view);
            setIsOpen(false);
            view.focus();
    });

    if (!schema.nodes.heading) return null;

    return (<>
        <div
            ref={ref}
            className='MenuItem'
            onClick={() => setIsOpen(true)}
        >
            <Icons.Heading/>
        </div>

        {ref.current && <Menu
            parent={ref.current}
            items={items}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onClick={onClick}
            horizontal='inner-left'
        />}
    </>);
};

const Icon: FC<{ level: number}> = ({ level }) => {
    switch (level) {
        case 2: return <Icons.Heading2/>;
        case 3: return <Icons.Heading3/>;
        case 4: return <Icons.Heading4/>;
        case 5: return <Icons.Heading5/>;
        case 6: return <Icons.Heading6/>;
        default: return <Icons.Heading/>;
    }
};

export default HeaderMenu;