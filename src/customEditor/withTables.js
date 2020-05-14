import { Range, Editor, Point, Transforms, Node } from "slate"
import { customElement } from "../helpers"

const withTables = (editor) => {
    const { deleteBackward, deleteForward, insertBreak, insertText } = editor

    const commonDelete = () => {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {
            // ### 实现的功能：在表格下面删除空元素时不进行合并 ###

            // 判断光标是否在位置0
            if (selection.anchor.offset === 0) {
                // 查找上一个节点
                const prevNode = Editor.previous(editor, { at: selection });
                if (prevNode) {
                    const [prevTableAfter] = Editor.nodes(editor, {
                        at: prevNode[1],
                        match: n => n.type === 'tableAfter',
                    });
                    // 如果上一个节点是table, 则阻止默认删除
                    if (prevTableAfter) {
                        const node = editor.children[selection.anchor.path[0]];
                        // 如果节点为空，则删除节点
                        if (Node.string(node).length === 0) {
                            Transforms.removeNodes(editor, {
                                at: selection
                            })
                        }
                        return true;
                    }
                }
            }

            // 判断是否是表格元素
            const [tableWrap] = Editor.nodes(editor, {
                match: (n) => n.type === 'tableWrap'
            });

            if (tableWrap) {
                // ### 实现的功能： 如果是在表格之前删除，则阻止删除，如果是在表格之后进行删除，则删除表格
                const [tableBefore] = Editor.nodes(editor, {
                    match: (n) => n.type === 'tableBefore'
                })
                if (tableBefore) {
                    return true;
                }

                const [tableAfter] = Editor.nodes(editor, {
                    match: (n) => n.type === 'tableAfter'
                })
                if (tableAfter) {
                    Transforms.removeNodes(editor, {
                        match: n => n.type === 'tableWrap'
                    })
                    return true;
                }
    
    
                const [cell] = Editor.nodes(editor, {
                    match: (n) => n.type === 'td'
                })
    
                if (cell) {
                    const [, cellPath] = cell
                    const start = Editor.start(editor, cellPath)
    
                    if (Point.equals(selection.anchor, start)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    editor.deleteBackward = (unit) => {
        if (commonDelete()) return
        deleteBackward(unit)
    }

    editor.deleteForward = (unit) => {
        if (commonDelete()) return
        deleteForward(unit)
    }

    editor.insertBreak = () => {
        const { selection } = editor
        const p = customElement('p');

        if (selection && Range.isCollapsed(selection)) {
            const [tableBefore] = Editor.nodes(editor, {
                match: (n) => n.type === 'tableBefore'
            })
            if (tableBefore) {
                return
            }

            const [tableAfter] = Editor.nodes(editor, {
                match: (n) => n.type === 'tableAfter'
            })
            if (tableAfter) {
                Transforms.insertNodes(editor, p, {
                    match: n => n.type === 'tableWrap'
                });
                return
            }

            const [table] = Editor.nodes(editor, { match: (n) => n.type === 'table' })

            if (table) {
                const [td] = Editor.nodes(editor, { match: (n) => n.type === 'td' })
                if (td) {
                    Transforms.insertNodes(editor, p);
                }
                return
            }
        }

        insertBreak()
    }

    editor.insertText = (text) => {
        const [tableAfter] = Editor.nodes(editor, {
            match: (n) => n.type === 'tableAfter'
        })
        if (tableAfter) {
            return
        }
        insertText(text);
    }

    return editor
}

export default withTables;
