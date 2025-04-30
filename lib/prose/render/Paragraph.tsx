import { CSSProperties, FC, useEffect, useState } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const Paragraph: FC<Props> = ({ node }) => {
    const [ style, setStyle ] = useState<CSSProperties|undefined>();

    useEffect(() => {
        const align = node.attrs?.align;
        if (align !== 'right' && align !== 'center' && align !== 'justify') {
            setStyle(undefined);
        } else {
            setStyle({ textAlign: align });
        }
    }, [ node ]);

    return (
        <p style={style}>
            {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
        </p>
    );
};

export default Paragraph;
