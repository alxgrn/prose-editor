import { FC, useEffect, useState } from 'react';
import { Node } from './ProseRender';
import { ERROR_EMBED } from '../../utils/config';
import { validateRutubeURL, validateVkvideoURL, validateYoutubeURL } from '../../utils/link';

type Props = {
    node: Node;
};

const Video: FC<Props> = ({ node }) => {
    const [ src, setSrc ] = useState('');
    const [ rutube, setRutube ] = useState('');
    const [ youtube, setYoutube ] = useState('');
    const [ vkvideo, setVkvideo ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ count, setCount ] = useState(0);
    const allow = 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';

    useEffect(() => {
        setTitle(node.attrs?.title ? `${node.attrs.title}`: '');
        let src = node.attrs?.src;
        if (typeof src === 'string') src = [src];
        (src as string[]).forEach(url => {
            if (validateRutubeURL(url)) {
                setSrc(url);
                setRutube(url); 
            } else if (validateYoutubeURL(url)) {
                setSrc(url);
                setYoutube(url); 
            } else if (validateVkvideoURL(url)) {
                setSrc(url);
                setVkvideo(url);
            }
        });
    }, [ node ]);

    useEffect(() => {
        let count = 0;
        if (rutube)  count ++;
        if (youtube) count ++;
        if (vkvideo) count ++;
        setCount(count);
    }, [ rutube, youtube, vkvideo ]);

    if (!count) return (
        <div className='image'>
            <img src={ERROR_EMBED}/>
            {title && <div className='image-title'>{title}</div>}
        </div>
    );

    return (
        <div className='video'>
            {count > 1 && <div className='video-switcher'>
                {rutube  && <div onClick={() => setSrc(rutube)}  className={src === rutube  ? 'active' : ''}>RuTube</div>}
                {youtube && <div onClick={() => setSrc(youtube)} className={src === youtube ? 'active' : ''}>YouTube</div>}
                {vkvideo && <div onClick={() => setSrc(vkvideo)} className={src === vkvideo ? 'active' : ''}>VK Video</div>}
            </div>}
            <iframe src={src} allow={allow}/>
            {title && <div className='video-title'>{title}</div>}
        </div>
    );
};

export default Video;
