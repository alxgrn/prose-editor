import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const TableRow: FC<Props> = ({ node }) => (
    <tr>
        {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
    </tr>
);

export default TableRow;
