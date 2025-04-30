/**
 * Меню преобразования текущего блока
 */
import { Icons } from "@alxgrn/telefrag-ui";
import { FC, useEffect, useState } from "react";
import { Schema } from "prosemirror-model";
import { setBlockType } from "prosemirror-commands";
import MenuItem, { TMenuItem } from "../MenuItem";

type Props = {
    schema: Schema;
};

const MakeBlockMenu: FC<Props> = ({ schema }) => {
    const [ paragraph, setParagraph ] = useState<TMenuItem|undefined>(undefined);
    const [ codeBlock, setCodeBlock ] = useState<TMenuItem|undefined>(undefined);

    useEffect(() => {
        setParagraph(undefined);
        setCodeBlock(undefined);

        if (schema.nodes.paragraph) {
            const node = schema.nodes.paragraph;
            setParagraph({
                icon: <Icons.Type/>,
                command: setBlockType(node),
            });
        }
    
        if (schema.nodes.code_block) {
            const node = schema.nodes.code_block;
            setCodeBlock({
                icon: <Icons.CodeXml/>,
                command: setBlockType(node),
            });
        }
    }, [ schema ]);

    return (<>
        {paragraph && <MenuItem item={paragraph}/>}
        {codeBlock && <MenuItem item={codeBlock}/>}
    </>);
};

export default MakeBlockMenu;
