import { FC, ReactNode } from 'react';
import { Node } from './ProseRender';

type Props = {
    node: Node;
};

const Text: FC<Props> = ({ node }) => {
    if (!node.text) return null;

    const inline = (marks: any, text: string): ReactNode => {
        if (!Array.isArray(node.marks)) return <>{text}</>
        if (!marks.length) return <>{text}</>;

        const type = marks[0].type;
        const href = marks[0].attrs?.href;

        switch (type) {
            case 'em':
                return <em>{inline(marks.slice(1), text)}</em>;
            case 'code':
                return <code>{inline(marks.slice(1), text)}</code>;
            case 'strong':
                return <strong>{inline(marks.slice(1), text)}</strong>;
            case 'underline':
                return <u>{inline(marks.slice(1), text)}</u>;
            case 'strikethrough':
                return <s>{inline(marks.slice(1), text)}</s>;
            case 'link':
                return href ? <a target='_blank' href={href}>{inline(marks.slice(1), text)}</a> : <>{inline(marks.slice(1), text)}</>;
            default:
                return <>{inline(marks.slice(1), text)}</>;
        }
    };

    return inline(node.marks, node.text);
};

export default Text;
