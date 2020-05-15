import isHotkey from "is-hotkey";
import { toggleMark } from "../helpers";

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code'
}

export const editableKeyDown = (e, editor) => {
    for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, e)) {
            e.preventDefault()
            const mark = HOTKEYS[hotkey]
            toggleMark(editor, mark)
        }
    }
}
