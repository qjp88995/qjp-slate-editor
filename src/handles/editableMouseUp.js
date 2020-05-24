import { Transforms, Range } from "slate";
import { MyEditor } from "../helpers";
import { tableSelection } from "../rendering/elements/tableSelection";
import { tableResize } from "../rendering/elements/tableResize";

export const editableMouseUp = (event, editor) => {
    const { selection } = editor;
    if (!selection) {
        if (tableSelection.table && tableSelection.selection && !tableSelection.flag) {
            // event.preventDefault();
            const [firstCell] = MyEditor.getSelectedTableCells(editor);
            const [, firstCellPath] = firstCell;
            const point = MyEditor.point(editor, firstCellPath, { edge: 'start' });
            Transforms.select(editor, { anchor: point, focus: point });
        }
    } else {
        if (Range.isCollapsed(selection)) {
            const [table] = MyEditor.nodes(editor, {
                match: n => n.type === 'table',
            });
            if (!table || table !== tableSelection.table) {
                tableSelection.clear();
            }
        }
    }
    if (tableResize.table && tableResize.flag) {
        tableResize.endXy = [event.pageX, event.pageY];
        MyEditor.resizeTable(editor);
    }
}