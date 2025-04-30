import { FC } from 'react';

type Props = {
    changed?: boolean;
    onChange: (mode: string) => void;
};

const ModeSelector: FC<Props> = ({ changed, onChange }) => {
    return (<div className={changed ? 'toolbar changed' : 'toolbar'}>
        <div onClick={() => onChange('viewer')}>Viewer</div>
        <div onClick={() => onChange('editor')}>Editor</div>
        <div onClick={() => onChange('notes')}>Notes</div>
    </div>);
};

export default ModeSelector;
