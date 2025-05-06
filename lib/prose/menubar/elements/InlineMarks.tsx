/**
 * Блок атрибутов инлайн элментов
 */
import { FC, useEffect, useState } from 'react';
import { Icons } from '@alxgrn/telefrag-ui';
import { EditorState } from 'prosemirror-state';
import { MarkType, Schema } from "prosemirror-model";
import { toggleMark } from "prosemirror-commands";
import MenuBlock from '../MenuBlock';
import { TMenuItem } from '../MenuItem';
import InsertLink from './InsertLink';

type Props = {
    schema: Schema;
};

export const InlineMarks: FC<Props> = ({ schema }) => {
    const [ items, setItems ] = useState<TMenuItem[]>([]);
    const [ isLinkPrompt, setIsLinkPrompt ] = useState(false);

    // Определим какие кнопки нужны в меню
    useEffect(() => {
        const inline: TMenuItem[] = [];

        if (schema.marks.strong) {
            const mark = schema.marks.strong;
            inline.push({
                icon: <Icons.Bold/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark),
            });
        }

        if (schema.marks.em) {
            const mark = schema.marks.em;
            inline.push({
                icon: <Icons.Italic/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark),
            });
        }

        if (schema.marks.underline) {
            const mark = schema.marks.underline;
            inline.push({
                icon: <Icons.Underline/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark),
            });
        }

        if (schema.marks.strikethrough) {
            const mark = schema.marks.strikethrough;
            inline.push({
                icon: <Icons.Strikethrough/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark),
            });
        }

        if (schema.marks.code) {
            const mark = schema.marks.code;
            inline.push({
                icon: <Icons.Code/>,
                command: toggleMark(mark),
                isActive: (s) => markActive(s, mark),
            });
        }        
        
        if (schema.marks.link) {
            const mark = schema.marks.link;
            inline.push({
                icon: <Icons.Link/>,
                isActive: (state) => markActive(state, mark),
                isDisabled: (state) => { 
                    if (state.selection.empty) return true;
                    return !toggleMark(mark)(state);
                },
                command: (state, dispatch, view) => {
                    if (markActive(state, mark)) {
                        toggleMark(mark)(state, dispatch);
                        view?.focus();
                    } else {
                        setIsLinkPrompt(true);
                    }
                    return true;
                },
            });
        }

        setItems(inline);
    }, [ schema ]);

    if (items.length < 1) return null;

    return (<>
        <MenuBlock items={items} />
        <InsertLink isOpen={isLinkPrompt} schema={schema} onClose={() => setIsLinkPrompt(false)} />
    </>);
};

/**
 * Функция из prosemirror-example-setup/src/menu.ts
 */
function markActive(state: EditorState, type: MarkType) {
    let {from, $from, to, empty} = state.selection;
    if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
    else return state.doc.rangeHasMark(from, to, type);
};

export default InlineMarks;
