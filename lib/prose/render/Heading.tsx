import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const Heading: FC<Props> = ({ node }) => {

    if (!Array.isArray(node.content)) return null;

    switch (node.attrs?.level) {
        case 1: return <h1>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</h1>;
        case 2: return <h2>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</h2>;
        case 3: return <h3>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</h3>;
        case 4: return <h4>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</h4>;
        case 5: return <h5>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</h5>;
        case 6: return <h6>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</h6>;
        default: return <h2>{node.content.map((n, i) => <ProseRender node={n} key={i} />)}</h2>;
    }
};

export default Heading;
