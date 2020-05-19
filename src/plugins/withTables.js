import { Range, Editor, Point, Transforms } from "slate"
import { createDefaultElement } from "../helpers"

export const withTables = (editor) => {
    const { deleteBackward, deleteForward, insertBreak, deleteFragment } = editor;

    editor.deleteBackward = (unit) => {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {

            // 判断是否是表格元素
            const [table] = Editor.nodes(editor, {
                match: (n) => n.type === 'table',
            });

            if (table) {
                const [cell] = Editor.nodes(editor, {
                    match: (n) => n.type === 'table-cell',
                })
    
                if (cell) {
                    const [, cellPath] = cell;
                    const start = Editor.start(editor, cellPath);
                    if (Point.equals(selection.anchor, start)) {
                        return;
                    }
                }
            } else {
                // 判断光标是否在位置0
                if (selection.anchor.offset === 0) {
                    // 查找上一个节点
                    const prevNode = Editor.previous(editor, { at: selection });
                    if (prevNode) {
                        const [prevTable] = Editor.nodes(editor, {
                            at: prevNode[1],
                            match: n => n.type === 'table',
                        });
                        // 如果上一个节点是table, 则阻止默认删除
                        if (prevTable) {
                            const prevNode = Editor.previous(editor, {
                                at: prevTable[1],
                            });
                            const end = Editor.end(editor, prevNode[1])
                            Transforms.setSelection(editor, {
                                anchor: selection.anchor,
                                focus: end,
                            })
                            return;
                        }
                    }
                }

            }
        }
        deleteBackward(unit)
    }

    editor.deleteForward = (unit) => {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {

            // 判断是否是表格元素
            const [table] = Editor.nodes(editor, {
                match: (n) => n.type === 'table',
            });

            if (table) {
                const [cell] = Editor.nodes(editor, {
                    match: (n) => n.type === 'table-cell',
                })
    
                if (cell) {
                    const [, cellPath] = cell;
                    const end = Editor.end(editor, cellPath);
    
                    if (Point.equals(selection.anchor, end)) {
                        return;
                    }
                }
            }
        }
        deleteForward(unit)
    }

    editor.deleteFragment = () => {
        // const { selection } = editor
        // const nodes = Editor.nodes(editor, {
        //     at: selection
        // });
        // const [...tables] = Editor.nodes(editor, {
        //     match: n => n.type === 'table',
        // });
        // const str = Editor.string(editor, selection);
        // console.log(tables, str)
        // for(const [element, path] of nodes) {
        //     const isEditor = Editor.isEditor(element)
        //     console.log(element, path, isEditor)
        // }
        // return
        deleteFragment()
    }

    editor.insertBreak = () => {
        const { selection } = editor

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
                Transforms.insertNodes(editor, createDefaultElement(), {
                    match: n => n.type === 'tableWrap'
                });
                return
            }

            const [table] = Editor.nodes(editor, { match: (n) => n.type === 'table' })

            if (table) {
                const [td] = Editor.nodes(editor, { match: (n) => n.type === 'table-cell' })
                if (td) {
                    Transforms.insertNodes(editor, createDefaultElement());
                }
                return
            }
        }

        insertBreak()
    }

    return editor
}
