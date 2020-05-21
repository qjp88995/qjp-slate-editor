import { Range } from 'slate';
import { MyEditor } from '../helpers/MyEditor';

export const unSelectTableCell = (event, editor) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
        event.preventDefault();
        const [table] = MyEditor.nodes(editor, {
            match: n => n.type === 'table',
        });
        if (!table) {
            const [...tables] = MyEditor.nodes(editor, {
                at: [],
                match: n => n.type === 'table',
            });
            tables.forEach(item => {
                MyEditor.cancelSelectedTableCells(editor, item);
            });
        }
    }
}