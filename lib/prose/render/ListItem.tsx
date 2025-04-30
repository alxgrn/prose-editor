import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const ListItem: FC<Props> = ({ node }) => (
    <li>
        {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
    </li>
);


export default ListItem;
