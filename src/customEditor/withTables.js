import { Range, Editor, Point, Transforms } from "slate"

const withTables = (editor) => {
    const { deleteBackward, deleteForward, insertBreak } = editor

    editor.deleteBackward = (unit) => {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {

            // 需要实现的功能：在表格下面删除空元素时不进行合并
            const element = Editor.node(editor, selection);
            const isEmpty = Editor.isEmpty(editor, element);
            console.log(isEmpty)
            const prevNode = Editor.previous(editor);
            if (prevNode) {
                const [, prevNodePath] = prevNode;
                const parent = Editor.parent(editor, prevNodePath);
                if (parent) {
                    const [{ type }] = parent;
                    if (type === 'tableAfter') {

                        return
                    }
                }
            }

            const [tableWrap] = Editor.nodes(editor, {
                match: (n) => n.type === 'tableWrap'
            });

            if (tableWrap) {
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
                    Transforms.removeNodes(editor, {
                        match: n => n.type === 'tableWrap'
                    })
                    return
                }
    
    
                const [cell] = Editor.nodes(editor, {
                    match: (n) => n.type === 'td'
                })
    
                if (cell) {
                    const [, cellPath] = cell
                    const start = Editor.start(editor, cellPath)
    
                    if (Point.equals(selection.anchor, start)) {
                        return
                    }
                }
            }
        }

        deleteBackward(unit)
    }

    editor.deleteForward = (unit) => {
        const { selection } = editor
        console.log(unit)
        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) => n.type === 'td'
            })

            if (cell) {
                const [, cellPath] = cell
                const end = Editor.end(editor, cellPath)

                if (Point.equals(selection.anchor, end)) {
                    return
                }
            }
        }

        deleteForward(unit)
    }

    editor.insertBreak = () => {
        const { selection } = editor

        if (selection) {
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
                const text = { text: '' };
                const p = { type: 'p', children: [text] };
                Transforms.insertNodes(editor, p, {
                    match: n => n.type === 'tableWrap'
                });
                return
            }

            const [table] = Editor.nodes(editor, { match: (n) => n.type === 'table' })

            if (table) {
                return
            }
        }

        insertBreak()
    }

    return editor
}

export default withTables;
