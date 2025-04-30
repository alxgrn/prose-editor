import { FC, useEffect, useState } from 'react';
import { Node } from './ProseRender';
import { ERROR_IMAGE_DATA } from '../../config';
import { sanitizeVideoURL } from '../../utils/link';

type Props = {
    node: Node;
};

const Video: FC<Props> = ({ node }) => {
    const [ src, setSrc ] = useState('');
    const [ title, setTitle ] = useState('');
    const allow = 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

    useEffect(() => {
        setSrc(node.attrs?.src ? `${node.attrs?.src}` : '');
        setTitle(node.attrs?.title ? `${node.attrs?.title}`: '');
    }, [ node ]);

    if (!sanitizeVideoURL(src)) return (
        <div title={title} className='image'>
            <img src={ERROR_IMAGE_DATA}/>
        </div>
    );

    return (
        <div title={title} className='video'>
            <iframe src={src} allow={allow}/>
        </div>
    );
};

export default Video;
