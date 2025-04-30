/**
 * Меню выбора выравнивания параграфа
 */
import { Icons, Menu } from "@alxgrn/telefrag-ui";
import { MenuAlternative, MenuItem as UIMenuItem } from "@alxgrn/telefrag-ui/dist/components/ui/menu/Menu";
import { useEditorEventCallback } from "@handlewithcare/react-prosemirror";
import { FC, useRef, useState } from "react";
import { Schema } from "prosemirror-model";

const items: MenuAlternative[] = [{
    id: 'left',
    icon: <Icons.AlignLeft/>,
    text: 'Прижать влево',
},{
    id: 'right',
    icon: <Icons.AlignRight/>,
    text: 'Прижать вправо',
},{
    id: 'center',
    icon: <Icons.AlignCenter/>,
    text: 'Отцентровать',
},{
    id: 'justify',
    icon: <Icons.AlignJustify/>,
    text: 'Выровнять по краям',
}];

type Props = {
    schema: Schema;
};

const AlignMenu: FC<Props> = ({ schema }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ isOpen, setIsOpen ] = useState(false);

    const onClick = useEditorEventCallback((view, item: UIMenuItem) => {
        if (!view || !item.id) return;
        const align = item.id === 'left' ? null : item.id;
        const { $from, $to } = view.state.selection;
        const nodeRange = $from.blockRange($to);
        if (nodeRange) {
            const parent = view.state.doc;
            let tr = view.state.tr;
            parent.nodesBetween(nodeRange.start, nodeRange.end, (node, pos) => {
                if (node.type.name === 'paragraph') {
                    tr = tr.setNodeMarkup(pos, null, { align });
                }
            });
            view.dispatch(tr);
        }
        view.focus();
        setIsOpen(false);
    });

    if (!schema.nodes.paragraph) return null;

    return (<>
        <div
            ref={ref}
            className='MenuItem'
            onClick={() => setIsOpen(true)}
        >
            <Icons.AlignLeft/>
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

export default AlignMenu;
