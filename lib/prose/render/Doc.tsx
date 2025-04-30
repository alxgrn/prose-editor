import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
    className?: string;
};

const Doc: FC<Props> = ({ node, className }) => (<div className={className}>
        {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i}/>)}
    </div>
);

export default Doc;
