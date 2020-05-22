import { Range } from "slate";
import { MyEditor } from "../helpers";
import { tableSelection } from "../rendering/elements/Table";

export const editableClick = (event, editor) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
        event.preventDefault();
        const [table] = MyEditor.nodes(editor, {
            match: n => n.type === 'table',
        });
        if (!table) {
            tableSelection.clear();
        }
    }
}