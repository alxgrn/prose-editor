import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const Table: FC<Props> = ({ node }) => (
    <table>
        <tbody>
            {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
        </tbody>
    </table>
);

export default Table;
