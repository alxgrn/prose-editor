/**
 * Кнопка в меню
 */
import { FC, ReactNode, RefObject, useState } from 'react';
import { Command, EditorState } from 'prosemirror-state';
import { useEditorEffect, useEditorEventCallback } from '@handlewithcare/react-prosemirror';
import './MenuItem.css';

export type TMenuItem = {
    icon: ReactNode;
    command: Command;
    isActive?: (s: EditorState) => boolean; // установлен ли атрибут у строкового элемента
    isSelected?: (s: EditorState) => boolean; // выбран ли обрамляющий блок у ноды
    isDisabled?: (s: EditorState) => boolean; // запрещена ли кнопка
};

type Props = {
    ref?: RefObject<HTMLDivElement|null>;
    item: TMenuItem;
};

const MenuItem: FC<Props> = ({ ref, item }) => {
    const [ active, setActive ] = useState<boolean|undefined>(true);
    const [ disabled, setDisabled ] = useState<boolean|undefined>(false);
    const [ selected, setSelected ] = useState<boolean|undefined>(false);

    useEditorEffect((view) => {
        if (!view) return;
        setActive(item.isActive && item.isActive(view.state));
        setSelected(item.isSelected && !item.isSelected(view.state));
        if (item.isDisabled) {
            setDisabled(item.isDisabled(view.state));
        } else {
            setDisabled(!item.command(view.state));
        }
    });

    const onClick = useEditorEventCallback((view) => {
        if (!view) return;
        if (!disabled) item.command(view.state, view.dispatch, view);
        view.focus();
    });

    if (selected) return null;

    return (
        <div
            ref={ref}
            className={`MenuItem ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onClick();
            }}
        >
            {item.icon}
        </div>
    );
};

export default MenuItem;
