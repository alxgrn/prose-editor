/**
 * Рендер публикации в формате prose
 */
import { FC, ReactNode } from 'react';
import Paragraph from './Paragraph';
import Text from './Text';
import Doc from './Doc';
import Image from './Image';
import Blockquote from './Blockquote';
import Table from './Table';
import TableRow from './TableRow';
import TableCell from './TableCell';
import Heading from './Heading';
import List from './List';
import ListItem from './ListItem';
import CodeBlock from './CodeBlock';
import HorizontalRule from './HorizontalRule';
import Video from './Video';
import HardBreak from './HardBreak';

export type Node = {
    type: string;
    text?: string;
    content?: Node[];
    attrs?: {
        [name: string]: string|number|null;
    };
    marks?: [{
        [name: string]: string|number|null;
    }];
};

type Props = {
    node?: Node;
    className?: string;
};

const ProseRender: FC<Props> = ({ node, className }) => {
    if (!node) return null;

    const render = (node: Node): ReactNode => {
        switch (node.type) {
            case 'doc':
                return <Doc node={node} className={className} />;
            case 'list_item':
                return <ListItem node={node} />;
            case 'bullet_list':
            case 'ordered_list':
                return <List node={node} />;
            case 'image':
                return <Image node={node} />;
            case 'video':
                return <Video node={node} />;
            case 'text':
                return <Text node={node} />;
            case 'table':
                return <Table node={node} />;
            case 'table_row':
                return <TableRow node={node} />;
            case 'table_cell':
            case 'table_header':
                return <TableCell node={node} />;
            case 'heading':
                return <Heading node={node} />;
            case 'code_block':
                return <CodeBlock node={node} />;
            case 'paragraph':
                return <Paragraph node={node} />;
            case 'blockquote':
                return <Blockquote node={node} />;
            case 'horizontal_rule':
                return <HorizontalRule />;
            case 'hard_break':
                return <HardBreak />;
            default:
                return <span className='unknown_node_type'>{node.type}</span>;
        }
    };

    return render(node);
};

export default ProseRender;
