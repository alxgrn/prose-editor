import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const CodeBlock: FC<Props> = ({ node }) => (
    <pre>
        {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
    </pre>
);

export default CodeBlock;
