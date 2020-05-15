import { Editor, Range, Transforms } from "slate";

export const editableClick = (e, editor) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
        e.preventDefault();
        const [table] = Editor.nodes(editor, {
            match: n => n.type === 'table',
        });
        if (table) {
            const [, tablePath] = table;
            const [...cells] = Editor.nodes(editor, {
                at: [],
                match: n => n.type === 'table-cell',
            });
            if (e.ctrlKey) {
                cells
                .filter(([, cellPath]) => cellPath.join('').slice(0, tablePath.length) !== tablePath.join(''))
                .forEach(([cellElem, cellPath]) => {
                    Transforms.setNodes(editor, {
                        ...cellElem,
                        selected: false,
                    }, {
                        at: cellPath,
                    });
                });
                const [cell] = Editor.nodes(editor, {
                    match: n => n.type === 'table-cell',
                });
                if (cell) {
    
                    const [...selectedCells] = Editor.nodes(editor, {
                        match: n => n.type === 'table-cell',
                    });
                    // if (selectedCells.length === 0)
                    const [cellElem, cellPath] = cell;
                    Transforms.setNodes(editor, {
                        ...cellElem,
                        selected: !cellElem.selected,
                    }, {
                        at: cellPath,
                    });
                }
            } else {
                cells
                .forEach(([cellElem, cellPath]) => {
                    Transforms.setNodes(editor, {
                        ...cellElem,
                        selected: false,
                    }, {
                        at: cellPath,
                    });
                });
            }
        } else {
            const [...cells] = Editor.nodes(editor, {
                at: [],
                match: n => n.type === 'table-cell' && n.selected,
            });
            cells.forEach(([cellElem, cellPath]) => {
                Transforms.setNodes(editor, {
                    ...cellElem,
                    selected: false,
                }, {
                    at: cellPath,
                });
            });
        }
    }
}