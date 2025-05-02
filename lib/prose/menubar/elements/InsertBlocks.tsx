/**
 * Кнопки для вставки блоков
 */
import { FC, useEffect, useState } from 'react';
import MenuBlock from '../MenuBlock';
import { Fragment, Node, NodeType, Schema } from "prosemirror-model";
import { Icons } from '@alxgrn/telefrag-ui';
import { Command, EditorState, TextSelection, Transaction } from 'prosemirror-state';
import InsertImage from './InsertImage';
import InsertVideo from './InsertVideo';
import { TMenuItem } from '../MenuItem';
import { isInTable } from 'prosemirror-tables';

type Props = {
    schema: Schema;
};

export const InsertBlocks: FC<Props> = ({ schema }) => {
    const [ items, setItems ] = useState<TMenuItem[]>([]);
    const [ isImagePrompt, setIsImagePrompt ] = useState(false);
    const [ isVideoPrompt, setIsVideoPrompt ] = useState(false);

    // Определим какие кнопки нужны в меню
    useEffect(() => {
        const insert: TMenuItem[] = [];

        if (schema.nodes.image) {
            const node = schema.nodes.image;
            insert.push({
                icon: <Icons.Image/>,
                isDisabled: (state) => { return !canInsert(state, node) },
                command: () => { setIsImagePrompt(true); return true; },
            });
        }

        if (schema.nodes.video) {
            const node = schema.nodes.video;
            insert.push({
                icon: <Icons.Film/>,
                isDisabled: (state) => { return !canInsert(state, node) },
                command: () => { setIsVideoPrompt(true); return true; },
            });
        }

        if (schema.nodes.horizontal_rule) {
            const node = schema.nodes.horizontal_rule;
            insert.push({
                icon: <Icons.FlipVertical/>,
                isDisabled: (state) => { return !canInsert(state, node) },
                command: (state, dispatch) => {
                    if (dispatch) {
                        dispatch(state.tr.replaceSelectionWith(node.create()));
                        return true;
                    }
                    return false;
                },
            });
        }

        if (schema.nodes.table) {
            insert.push({
                icon: <Icons.Table/>,
                isDisabled: isInTable,
                command: insertTable(),
            });
        }

        setItems(insert);
    }, [ schema ]);

    if (items.length < 1) return null;

    return (<>
        <MenuBlock items={items} />
        <InsertImage isOpen={isImagePrompt} onClose={() => setIsImagePrompt(false)} />
        <InsertVideo isOpen={isVideoPrompt} schema={schema} onClose={() => setIsVideoPrompt(false)} />
    </>);
};

/**
 * Функция основана на prosemirror-example-setup/src/menu.ts
 */
export const canInsert = (state: EditorState, nodeType: NodeType) => {
    let $from = state.selection.$from;
    for (let d = $from.depth; d >= 0; d--) {
        let index = $from.index(d);
        if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
    }
    return false;
};

/**
 * Вставка таблицы.
 * Оригинал функции вставки таблицы тут:
 * https://discuss.prosemirror.net/t/how-co-create-table/3510/3
 */
function insertTable(): Command {
    return (
        state: EditorState,
        dispatch?: (tr: Transaction) => void
    ): boolean => {
        const offset: number = state.tr.selection.anchor + 1;
        const transaction: Transaction = state.tr;
        const cell: Node = state.schema.nodes.table_cell.createAndFill() as Node;
        const node: Node = state.schema.nodes.table.create(
            null,
            Fragment.fromArray([
                state.schema.nodes.table_row.create(
                    null,
                    Fragment.fromArray([cell, cell, cell])
                ),
                state.schema.nodes.table_row.create(
                    null,
                    Fragment.fromArray([cell, cell, cell])
                )
            ])
        );

        if (dispatch) {
            dispatch(
                transaction
                    .replaceSelectionWith(node)
                    .scrollIntoView()
                    .setSelection(
                        TextSelection.near(
                            transaction.doc.resolve(offset)
                        )
                    )
            );
        }

        return true;
    };
};

export default InsertBlocks;
