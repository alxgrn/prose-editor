import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const List: FC<Props> = ({ node }) => {
    if (!Array.isArray(node.content)) return null;
    if (node.type === 'bullet_list') return <ul>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</ul>;
    return <ol>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</ol>;
};

export default List;
