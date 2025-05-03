/**
 * Просмотровщик публикации в формате prose
 */
import { FC, useEffect, useState } from 'react';
import ProseRender, { Node } from './render/ProseRender';
import './Carousel.css';
import './ProseViewer.css';

type ProseViewerProps = {
    content: string;
};

const ProseViewer: FC<ProseViewerProps> = ({ content }) => {
    const [ doc, setDoc ] = useState<Node>();
    const [ error, setError ] = useState(false);

    useEffect(() => {
        try {
            setError(false);
            const doc = JSON.parse(content);
            setDoc(doc);
        } catch (error) {
            setError(true);
            console.error(`Can not parse Prose format: ${error}`);
        }
    }, [ content ]);

    if (error) return <div className='error'>ОШИБКА</div>;

    return <ProseRender node={doc} className='ProseViewer'/>;
};

export default ProseViewer;
