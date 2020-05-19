import { Editor, Transforms, Range } from 'slate';

export const createDefaultElement = (text = '') => {
    return { type: 'paragraph', children: [{ text }] };
}

export const createTableElement = (rows = 1, cols = 1) => ({
    type: 'table',
    children: new Array(rows).fill(null).map(() => ({
        type: 'table-row',
        children: new Array(cols).fill(null).map(() => ({
            type: 'table-cell',
            children: [ createDefaultElement() ],
        }))
    }))
});

export const isBlockActive = (editor, format) => {
    if (format === 'table-cell-merge') {
        return isTableCellMergeActive(editor);
    }
    if (format === 'table-cell-split') {
        return isTableCellSplitActive(editor);
    }
    const [match] = Editor.nodes(editor, {
        match: (n) => n.type === format
    });

    return !!match
};

export const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
};

export const isTableCellMergeActive = editor => {
    const [...cells] = Editor.nodes(editor, {
        at: [],
        match: n => n.type === 'table-cell' && n.selected,
    });
    return cells.length > 1;
};

export const isTableCellSplitActive = editor => {
    const [...cells] = Editor.nodes(editor, {
        match: n => n.type === 'table-cell' && (n.rowSpan > 1 || n.colSpan > 1),
    });
    return cells.length > 0;
};

export const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export const MyEditor = {
    ...Editor,
    toggleBlock(editor, format){
        const isActive = isBlockActive(editor, format)
        const isList = LIST_TYPES.includes(format)
    
        Transforms.unwrapNodes(editor, {
            match: (n) => LIST_TYPES.includes(n.type),
            split: true
        })
    
        Transforms.setNodes(editor, {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format
        })
    
        if (!isActive && isList) {
            const block = { type: format, children: [] }
            Transforms.wrapNodes(editor, block)
        }
    },
    toggleMark(editor, format){
        const isActive = isMarkActive(editor, format)
    
        if (isActive) {
            Editor.removeMark(editor, format)
        } else {
            Editor.addMark(editor, format, true)
        }
    },
    insertTable(editor, rows = 1, cols = 1) {
        Transforms.insertNodes(editor, [createTableElement(rows, cols), createDefaultElement()]);
    },
    mergeTableCells(editor) {
        const isActive = isTableCellMergeActive(editor);
        if (isActive) {
            const [firstCell] = Editor.nodes(editor, {
                at: [],
                match: n => n.type === 'table-cell' && n.selected,
            });
            const [table] = Editor.nodes(editor, {
                at: firstCell[1],
                match: n => n.type === 'table',
            });
            if (table) {
                const [firstTableRow] = Editor.nodes(editor, {
                    at: table[1],
                    match: n => n.type === 'table-row',
                });
                const [...firstTableRowCells] = Editor.nodes(editor, {
                    at: firstTableRow[1],
                    match: n => n.type === 'table-cell',
                });
                const maxColSpan = firstTableRowCells.reduce((total, item) => {
                    const [element] = item;
                    return total + Number((element.colSpan || 1));
                }, 0);
                const [...cells] = Editor.nodes(editor, {
                    at: table[1],
                    match: n => n.type === 'table-cell' && n.selected,
                });
                const rows = [];
                cells.forEach(item => {
                    const [, path] = item;
                    const index = rows.findIndex(it => Array.isArray(it) && it.length > 0 && it[0][1][it[0][1].length - 2] === path[path.length - 2]);
                    if (index > -1) {
                        rows[index].push(item)
                    } else {
                        rows.push([item]);
                    }
                });
                const rowSpan = rows.reduce((total, item) => {
                    const [elem] = item[0];
                    return total + Number((elem.rowSpan || 1));
                }, 0);
                const colSpan = rows[0].reduce((total, item) => {
                    const [elem] = item;
                    return total + Number(elem.colSpan || 1);
                }, 0);
                const [cell, ...otherCells] = cells;
                Transforms.setNodes(editor, {
                    rowSpan: maxColSpan === colSpan ? 1 : rowSpan,
                    colSpan,
                    selected: false,
                }, {
                    at: cell[1],
                });
                const children = [];
                const [lastNode] = Editor.nodes(editor, {
                    at: cell[1],
                    match: n => n.type === 'paragraph',
                    reverse: true,
                });
                const lastNodePath = [...lastNode[1]];
                lastNodePath.push(lastNodePath.pop() + 1);
                otherCells.forEach(([elem]) => {
                    children.push(...elem.children);
                });
                Transforms.insertNodes(editor, children, {
                    at: lastNodePath,
                });
                otherCells.reverse().forEach(([, path]) => {
                    const [tableRow] = Editor.nodes(editor, { at: path, match: n => n.type === 'table-row' });
                    if (tableRow) {
                        const [rowElement, rowPath] = tableRow;
                        if (rowElement.children.length === 1) {
                            Transforms.removeNodes(editor, {
                                at: rowPath,
                            });
                        } else {
                            Transforms.removeNodes(editor, {
                                at: path,
                            });
                        }
                    }
                });
                const point = Editor.point(editor, cell[1]);
                Transforms.setPoint(editor, point, { edge: 'anchor' });
            }
        }
    },
    splitTableCells(editor) {

    },
};