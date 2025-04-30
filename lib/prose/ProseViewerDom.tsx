/**
 * Просмотровщик публикации в формате prose,
 * в котором документ выводится в виде статического HTML
 */
import { FC, useEffect, useRef, useState } from 'react';
import { DOMSerializer, Node } from 'prosemirror-model';
import { schema } from './schema';
import './ProseViewer.css';

type ProseViewerProps = {
    content: string;
};

const ProseViewer: FC<ProseViewerProps> = ({ content }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        try {
            setError(false);
            const doc = Node.fromJSON(schema, JSON.parse(content));
            const dom = DOMSerializer.fromSchema(schema).serializeFragment(doc.content);
            ref.current?.appendChild(dom);
        } catch (error) {
            setError(true);
            console.error(`Can not parse Prose format: ${error}`);
        }
    }, [ ref, content ]);

    return (<div ref={ref} className='ProseViewer'>
        {error && <div className='error'>ОШИБКА</div>}
    </div>);
};

export default ProseViewer;
