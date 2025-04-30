import { FC, useEffect, useState } from 'react';
import ProseRender, { Node } from './ProseRender';

type Props = {
    node: Node;
};

const TableCell: FC<Props> = ({ node }) => {
    const [ halign, setHalign ] = useState<any>();
    const [ valign, setValign ] = useState<any>();
    const [ rowspan, setRowspan ] = useState<number>();
    const [ colspan, setColspan ] = useState<number>();

    useEffect(() => {
        setHalign(node.attrs?.halign);
        setValign(node.attrs?.valign);
        setRowspan(node.attrs?.rowspan ? parseInt(node.attrs.rowspan + '') : 1);
        setColspan(node.attrs?.colspan ? parseInt(node.attrs.colspan + '') : 1);
    }, [ node ]);

    if (node.type === 'table_header') return (
        <th
            colSpan={colspan}
            rowSpan={rowspan}
            style={{
                textAlign: halign,
                verticalAlign: valign,
            }}
        >
            {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
        </th>
    );

    return (
        <td
            colSpan={colspan}
            rowSpan={rowspan}
            style={{
                textAlign: halign,
                verticalAlign: valign,
            }}
        >
            {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
        </td>
    );
};

export default TableCell;
