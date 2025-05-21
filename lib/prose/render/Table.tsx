import { FC, useEffect, useState } from 'react';
import ProseRender, { Node } from './ProseRender';

const MIN_WIDTH = 50;

type CellAttrs = {
    colspan: number;
    rowspan: number;
    colwidth: number[] | null;
};

type Props = {
    node: Node;
};

const Table: FC<Props> = ({ node }) => {
    const [ width, setWidth ] = useState<number[]>([]);
    // Необходимо прочитать ширины столбцов и перевести их в проценты
    useEffect(() => {
        setWidth([]);
        if (!Array.isArray(node.content)) return;
        const row = node.content[0];
        if (!Array.isArray(row.content)) return;
        let width: number[] = [];
        for (let i = 0; i < row.content.length; i ++) {
            const attrs = row.content[i].attrs;
            if (!attrs) return;
            const { colspan, colwidth } = attrs as CellAttrs;
            width = width.concat(Array.isArray(colwidth) ? colwidth : Array(colspan).fill(MIN_WIDTH));
        }
        const fullWidth = width.reduce((a, b) => a + b, 0);
        width = width.map(w => Math.round((w * 100)/fullWidth));
        // Пофиксим возможную ошибку из-за округления
        width[width.length - 1] += 100 - width.reduce((a, b) => a + b, 0);
        setWidth(width);
    }, [ node ]);
    
    return (
    <table>
        {width.length > 0 &&
        <colgroup>
            {width.map((w, k) => <col key={k} width={`${w}%`}/>)}
        </colgroup>}

        <tbody>
            {Array.isArray(node.content) && node.content.map((n, i) => <ProseRender node={n} key={i} />)}
        </tbody>
    </table>
    );
};

export default Table;
