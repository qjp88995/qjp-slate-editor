import { Transforms } from "slate";
import { isBlockActive } from "./isBlockActive";

const LIST_TYPES = ['ul', 'ol'];

export const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: (n) => LIST_TYPES.includes(n.type),
        split: true
    })

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'li' : format
    })

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}
