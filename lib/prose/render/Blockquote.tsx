import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const Blockquote: FC<Props> = ({ node }) => (
    <blockquote>
        {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
    </blockquote>
);

export default Blockquote;
