import { Editor, Range } from 'slate';

export const editableMouseMove = (event, editor, mouseDown) => {
    if (mouseDown) {
        const { selection } = editor;
    
        if (selection) {
            const [table] = Editor.nodes(editor, {
                at: selection.anchor,
                match: n => n.type === 'table',
            });
            if (table && Range.isExpanded(selection)) {
                const [startTableCell] = Editor.nodes(editor, {
                    at: selection.anchor,
                    match: n => n.type === 'table-cell',
                });
                const [endTableCell] = Editor.nodes(editor, {
                    at: selection.focus,
                    match: n => n.type === 'table-cell',
                });
                if (startTableCell) {
                    // console.log(startTableCell, endTableCell)
                }
            }
        }
    }
}