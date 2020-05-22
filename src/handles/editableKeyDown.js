import isHotkey from "is-hotkey";
import { MyEditor } from "../helpers";
import { tableSelection } from "../rendering/elements/Table";

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code'
}

export const editableKeyDown = (e, editor) => {
    if (tableSelection.editor) {
        tableSelection.clear();
    }
    for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, e)) {
            e.preventDefault()
            const mark = HOTKEYS[hotkey]
            MyEditor.toggleMark(editor, mark)
        }
    }
}
