import { FC } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const Carousel: FC<Props> = ({ node }) => {

    if (!Array.isArray(node.content)) return null;

    return (
        <div className='carousel'>
            {node.content.map((n, i) => <ProseRender node={n} key={i} />)}
        </div>
    );
};

export default Carousel;
