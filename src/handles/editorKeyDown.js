import isHotkey from "is-hotkey";
import { MyEditor } from "../helpers";
import { tableSelection } from "../rendering/elements/tableSelection";
import { eventManager } from "./eventManager";

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code'
}

export const editorKeyDown = (e, editor) => {
    const events = eventManager.filter('editorKeyDown');
    events.forEach(item => item.event(event, editor));
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
