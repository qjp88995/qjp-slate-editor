import { Editor, Transforms } from 'slate';

export const createDefaultElement = (text = '', attr = {}) => {
    return { type: 'paragraph', ...attr, children: [{ text }] };
}

export const createTableElement = (rows = 1, cols = 1, attr = {}) => ({
    type: 'table',
    ...attr,
    children: new Array(rows).fill(null).map(() => createTableRowElement(cols))
});

export const createTableRowElement = (cols = 1, attr = {}) => ({
    type: 'table-row',
    ...attr,
    children: new Array(cols).fill(null).map(() => createTableCellElement())
});

export const createTableCellElement = (attr = {}) => ({
    type: 'table-cell',
    ...attr,
    children: [ createDefaultElement() ],
});

export const isBlockActive = (editor, format) => {
    if (format === 'table-cell-merge') {
        return isTableCellMergeActive(editor);
    }
    if (format === 'table-cell-split') {
        return isTableCellSplitActive(editor);
    }
    const tableActionFormat = [
        'table-row-insert-up',
        'table-row-insert-down',
        'table-col-insert-left',
        'table-col-insert-right',
        'table-row-delete',
        'table-col-delete',
    ];
    if (tableActionFormat.some(item => item === format)) {
        return isTableActionActive(editor);
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
    const [table] = Editor.nodes(editor, {
        at: [],
        match: n => n.type === 'table' && !n.selectedFlag && !!n.pathSelection && n.pathSelection[0].toString() !== n.pathSelection[1].toString(),
    });
    return !!table;
};

export const isTableCellSplitActive = editor => {
    const [...cells] = Editor.nodes(editor, {
        match: n => n.type === 'table-cell' && (n.rowSpan > 1 || n.colSpan > 1),
    });
    return cells.length > 0;
};

export const isTableActionActive = editor => {
    const [table] = Editor.nodes(editor, {
        match: n => n.type === 'table',
    });
    return !!table;
}

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
            const [table] = Editor.nodes(editor, {
                at: [],
                match: n => n.type === 'table' && !n.selectedFlag && !!n.pathSelection && n.pathSelection[0].toString() !== n.pathSelection[1].toString(),
            });
            if (table) {
                Transforms.setNodes(editor, {
                    pathSelection: null,
                }, {
                    at: table[1],
                });
                const cells = this.getSelectedTableCells(editor, table);
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
                    rowSpan,
                    colSpan,
                }, {
                    at: cell[1],
                });
                otherCells.forEach(([, path]) => {
                    const [lastNode] = Editor.nodes(editor, {
                        at: cell[1],
                        match: n => n.type === 'paragraph',
                        reverse: true,
                    });
                    const lastNodePath = [...lastNode[1]];
                    lastNodePath.push(lastNodePath.pop() + 1);
                    Transforms.moveNodes(editor, {
                        at: path,
                        match: n => n.type === 'paragraph',
                        to: lastNodePath,
                    });
                });
                otherCells.reverse().forEach(([, path]) => {
                    Transforms.removeNodes(editor, {
                        at: path,
                    });
                });
                const point = Editor.point(editor, cell[1]);
                Transforms.setPoint(editor, point, { edge: 'anchor' });
            }
        }
    },
    splitTableCells(editor) {
        const isActive = isTableCellSplitActive(editor);
        if (isActive) {
            const [...cells] = Editor.nodes(editor, {
                match: n => n.type === 'table-cell' && (n.rowSpan > 1 || n.colSpan > 1),
                reverse: true,
            });
            cells.forEach(([, path]) => {
                const [table] = Editor.nodes(editor, {
                    at: path,
                    match: n => n.type === 'table',
                });
                if (table) {
                    const [, tablePath] = table;
                    const [...rows] = Editor.nodes(editor, {
                        at: tablePath,
                        match: n => n.type === 'table-row',
                    });
                    const [firstRowElement] = rows[0];
                    const maxCols = firstRowElement.children.filter(item => item.type === 'table-cell').reduce((total, item) => total + (Number(item.colSpan) || 1), 0);
                    const deposit = new Array(maxCols).fill(0);
                    const grids = [];
                    rows.forEach(([, rowPath]) => {
                        const [...cells] = Editor.nodes(editor, {
                            at: rowPath,
                            match: n => n.type === 'table-cell',
                        });
                        for(let i = 0, j = 0; i < deposit.length;) {
                            if (deposit[i] === 0) {
                                if (cells[j]) {
                                    const [cellElement, cellPath] = cells[j];
                                    const rowSpan = Number(cellElement.rowSpan || 1);
                                    const colSpan = Number(cellElement.colSpan || 1);
                                    grids.push({
                                        element: cellElement,
                                        path: cellPath,
                                        offset: i,
                                        row: rowPath[rowPath.length - 1],
                                        colSpan,
                                        rowSpan,
                                    });
                                    j++;
                                    for (let k = 0; k < colSpan; k++) {
                                        deposit[i] = rowSpan - 1;
                                        i++;
                                    }
                                } else {
                                    i++;
                                }
                            } else {
                                deposit[i]--;
                                i++;
                            }
                        }
                    });
                    const currentGrid = grids.find(item => item.path.toString() === path.toString());
                    const { rowSpan, colSpan, row, offset } = currentGrid;
                    const cellPaths = [];
                    for (let i = 0; i < rowSpan; i++) {
                        const grid = grids.reverse().find(item => item.row === row + i && item.offset + item.colSpan <= offset);
                        if (grid) {
                            for (let j = 0; j < colSpan; j++) {
                                const _path = [...grid.path];
                                const colPath = _path.pop() + 1;
                                _path.pop();
                                cellPaths.push([..._path, row + i, colPath + j]);
                            }
                        }
                    }
                    Transforms.setNodes(editor, {
                        rowSpan: 1,
                        colSpan: 1,
                    }, {
                        at: cellPaths.shift(),
                    });
                    cellPaths.forEach(cellPath => {
                        Transforms.insertNodes(editor, createTableCellElement(), {
                            at: cellPath,
                        });
                    });
                }
            });
        }
    },
    insertUpTableRow(editor) {
        const isActive = isTableActionActive(editor);
        if (isActive) {
            const { selection } = editor;
            if (selection) {
                const [table] = Editor.nodes(editor, {
                    match: n => n.type === 'table',
                });
                if (table) {
                    const [, tablePath] = table;
                    const [row] = Editor.nodes(editor, {
                        match: n => n.type === 'table-row',
                    });
                    if (row) {
                        const [firstRow] = Editor.nodes(editor, {
                            at: tablePath,
                            match: n => n.type === 'table-row' && n.children.some(item => item.type === 'table-cell'),
                        });
                        const maxCols = firstRow[0].children.filter(item => item.type === 'table-cell').reduce((total, item) => total + (Number(item.colSpan) || 1), 0);
                        insertTableRow(editor, { maxCols, row });
                    }
                }
            }
        }
    },
    insertDownTableRow(editor) {
        const isActive = isTableActionActive(editor);
        if (isActive) {
            const { selection } = editor;
            if (selection) {
                const [table] = Editor.nodes(editor, {
                    match: n => n.type === 'table',
                });
                if (table) {
                    const [, tablePath] = table;
                    const [row] = Editor.nodes(editor, {
                        match: n => n.type === 'table-row',
                    });
                    if (row) {
                        const [, rowPath] = row;
                        const [firstRow] = Editor.nodes(editor, {
                            at: tablePath,
                            match: n => n.type === 'table-row' && n.children.some(item => item.type === 'table-cell'),
                        });
                        const maxCols = firstRow[0].children.filter(item => item.type === 'table-cell').reduce((total, item) => total + (Number(item.colSpan) || 1), 0);
                        const [cell] = Editor.nodes(editor, {
                            match: n => n.type === 'table-cell',
                        });
                        const rowSpan = cell[0].rowSpan;
                        if (rowSpan > 1) rowPath.push(rowPath.pop() + rowSpan - 1);
                        const nextRow = Editor.next(editor, {
                            at: rowPath,
                            match: n => n.type === 'table-row',
                        });
                        if (nextRow) {
                            insertTableRow(editor, { maxCols, row: nextRow });
                        } else {
                            rowPath.push(rowPath.pop() + 1);
                            Transforms.insertNodes(editor, createTableRowElement(maxCols), {
                                at: rowPath,
                            });
                        }
                    }
                }
            }
        }
    },
    insertLeftTableCol(editor) {
        const isActive = isTableActionActive(editor);
        if (isActive) {
            insertTableCol(editor, 'left');
        }
    },
    insertRightTableCol(editor) {
        const isActive = isTableActionActive(editor);
        if (isActive) {
            insertTableCol(editor, 'right');
        }
    },
    deleteTableRow(editor) {
        const isActive = isTableActionActive(editor);
        if (isActive) {
            const { selection } = editor;
            if (selection) {
                const [table] = Editor.nodes(editor, {
                    match: n => n.type === 'table',
                });
                if (table) {
                    const [, tablePath] = table;
                    // 统计第一行有多少格
                    const [firstRow, ...otherRows] = Editor.nodes(editor, {
                        at: tablePath,
                        match: n => n.type === 'table-row',
                    });
                    if (otherRows.length === 0 || otherRows.every(([element]) => Array.isArray(element.children) && element.children.filter(item => item.type === 'table-cell').length === 0)) {
                        Transforms.removeNodes(editor, {
                            at: tablePath,
                        });
                        return;
                    }
                    if (firstRow) {
                        const [firstRowElement] = firstRow;
                        const maxCols = firstRowElement.children.filter(item => item.type === 'table-cell').reduce((total, item) => total + (Number(item.colSpan) || 1), 0);
                        const [cell] = Editor.nodes(editor, {
                            match: n => n.type === 'table-cell',
                        });
                        const [row] = Editor.nodes(editor, {
                            match: n => n.type === 'table-row',
                        });
                        if (row && cell) {
                            const [cellElement] = cell;
                            const [, rowPath] = row;
                            const rowSpan = Number(cellElement.rowSpan || 1);
                            for(let i = 0; i < rowSpan; i++) {
                                const currentRowPath = [...rowPath];
                                currentRowPath.push(currentRowPath.pop() + i);
                                const [currentRow] = Editor.nodes(editor, {
                                    at: currentRowPath,
                                    match: n => n.type === 'table-row',
                                });
                                if (currentRow) {
                                    const [currentRowElement] = currentRow;
                                    const currentMaxCols = currentRowElement.children.filter(item => item.type === 'table-cell').reduce((total, item) => total + (Number(item.colSpan) || 1), 0);
                                    if (currentMaxCols < maxCols) {
                                        const maxCount = 1000;
                                        let fixCols = maxCols - currentMaxCols, count = 0, limitRowSpan = 2;
                                        while (fixCols > 0 && count < maxCount) {
                                            const prevRow = Editor.previous(editor, {
                                                at: currentRowPath,
                                                match: n => n.type === 'table-row',
                                            });
                                            if (prevRow) {
                                                const [, prevRowPath] = prevRow;
                                                const [...prevCells] = Editor.nodes(editor, {
                                                    at: prevRowPath,
                                                    match: n => n.type === 'table-cell' && n.rowSpan >= limitRowSpan,
                                                });
                                                prevCells.forEach(([element, path]) => {
                                                    Transforms.setNodes(editor, {
                                                        rowSpan: element.rowSpan - 1,
                                                    }, {
                                                        at: path,
                                                    });
                                                    fixCols-=Number(element.colSpan || 1);
                                                });
                                            }
                                            count++;
                                        }
                                    }
                                    const [...currentCells] = Editor.nodes(editor, {
                                        at: currentRowPath,
                                        match: n => n.type === 'table-cell',
                                    });
                                    currentCells.forEach(([currentCellElement, currentCellPath]) => {
                                        const colSpans = currentCells.reduce((total, [element, path]) => {
                                            if (currentCellPath[currentCellPath.length - 1] > path[path.length - 1]) return total + Number(element.colSpan || 1);
                                            return total;
                                        }, 0);
                                        if (currentCellElement.rowSpan > 1) {
                                            const nextRowPath = [...currentRowPath];
                                            nextRowPath.push(nextRowPath.pop() + 1)
                                            const [nextRow] = Editor.nodes(editor, {
                                                at: nextRowPath,
                                                match: n => n.type === 'table-row',
                                            });
                                            if (nextRow) {
                                                const [...nextCells] = Editor.nodes(editor, {
                                                    at: nextRowPath,
                                                    match: n => n.type === 'table-cell',
                                                });
                                                let spans = 0;
                                                const nextCell = nextCells.find(([element]) => {
                                                    spans += Number(element.colSpan || 1);
                                                    return spans === colSpans;
                                                });
                                                if (nextCell) {
                                                    const [, nextCellPath] = nextCell;
                                                    nextCellPath.push(nextCellPath.pop() + 1);
                                                    Transforms.insertNodes(editor, createTableCellElement({
                                                        rowSpan: currentCellElement.rowSpan - 1,
                                                        colSpan: currentCellElement.colSpan,
                                                    }), {
                                                        at: nextCellPath,
                                                    });
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                            for (let i = rowSpan; i > 0; i--) {
                                const currentRowPath = [...rowPath];
                                currentRowPath.push(currentRowPath.pop() + i - 1);
                                Transforms.removeNodes(editor, {
                                    at: currentRowPath,
                                });
                            }
                        }
                    }
                }
            }
        }
    },
    deleteTableCol(editor) {
        const isActive = isTableActionActive(editor);
        if (isActive) {
            const { selection } = editor;
            if (selection) {
                const [table] = Editor.nodes(editor, {
                    match: n => n.type === 'table',
                });
                if (table) {
                    const [, tablePath] = table;
                    // 统计第一行有多少格
                    const [...rows] = Editor.nodes(editor, {
                        at: tablePath,
                        match: n => n.type === 'table-row',
                    });
                    if (rows.length > 0) {
                        const [firstRowElement] = rows[0];
                        const maxCols = firstRowElement.children.filter(item => item.type === 'table-cell').reduce((total, item) => total + (Number(item.colSpan) || 1), 0);
                        if (maxCols === 1) {
                            Transforms.removeNodes(editor, {
                                at: tablePath,
                            });
                            return;
                        }
                        const [currentCell] = Editor.nodes(editor, {
                            match: n => n.type === 'table-cell',
                        });
                        if (currentCell) {
                            const [, currentCellPath] = currentCell;
                            const deposit = new Array(maxCols).fill(0);
                            const grids = [];
                            rows.forEach(([, rowPath]) => {
                                const [...cells] = Editor.nodes(editor, {
                                    at: rowPath,
                                    match: n => n.type === 'table-cell',
                                });
                                for(let i = 0, j = 0; i < deposit.length;) {
                                    if (deposit[i] === 0) {
                                        if (cells[j]) {
                                            const [cellElement, cellPath] = cells[j];
                                            const rowSpan = Number(cellElement.rowSpan || 1);
                                            const colSpan = Number(cellElement.colSpan || 1);
                                            grids.push([cellPath, i, colSpan, rowSpan]);
                                            j++;
                                            for (let k = 0; k < colSpan; k++) {
                                                deposit[i] = rowSpan - 1;
                                                i++;
                                            }
                                        } else {
                                            i++;
                                        }
                                    } else {
                                        deposit[i]--;
                                        i++;
                                    }
                                }
                            });
                            const currentGrid = grids.find(item => item[0].toString() === currentCellPath.toString());
                            if (currentGrid) {
                                const [, currentGridOffset, currentGridColSpan] = currentGrid;
                                grids.filter(([, offset, colSpan]) => offset === currentGridOffset || (offset > currentGridOffset && offset < currentGridOffset + currentGridColSpan) || (currentGridOffset > offset && currentGridOffset < offset + colSpan))
                                .reverse()
                                .forEach(([path, offset, colSpan, rowSpan]) => {
                                    if (offset === currentGridOffset) {
                                        if (colSpan > currentGridColSpan) {
                                            const nextPath = [...path];
                                            nextPath.push(nextPath.pop() + 1);
                                            Transforms.insertNodes(editor, createTableCellElement({
                                                rowSpan,
                                                colSpan: colSpan - currentGridColSpan,
                                            }), {
                                                at: nextPath,
                                            });
                                        }
                                        Transforms.removeNodes(editor, { at: path });
                                    } else if (offset > currentGridOffset) {
                                        if (offset + colSpan > currentGridOffset + currentGridColSpan) {
                                            const nextPath = [...path];
                                            nextPath.push(nextPath.pop() + 1);
                                            Transforms.insertNodes(editor, createTableCellElement({
                                                rowSpan,
                                                colSpan: (offset + colSpan) - (currentGridOffset + currentGridColSpan),
                                            }), {
                                                at: nextPath,
                                            })
                                        }
                                        Transforms.removeNodes(editor, { at: path });
                                    } else {
                                        const newColSpan = offset + colSpan > currentGridOffset + currentGridColSpan ? colSpan - currentGridColSpan : currentGridOffset - offset;
                                        Transforms.setNodes(editor, {
                                            colSpan: newColSpan,
                                        }, {
                                            at: path,
                                        });
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    },
    getSelectedTableCells(editor, table) {
        if (table) {
            const [tableElement, tablePath] = table;
            const { pathSelection } = tableElement;
            const [...rows] = Editor.nodes(editor, {
                at: tablePath,
                match: n => n.type === 'table-row',
            });
            if (rows.length > 0 && pathSelection) {
                const [startPath, endPath] = pathSelection;
                if (startPath && endPath && startPath.toString() !== endPath.toString()) {
                    const [firstRowElement] = rows[0];
                    const maxCols = firstRowElement.children.filter(item => item.type === 'table-cell').reduce((total, item) => total + (Number(item.colSpan) || 1), 0);
                    const deposit = new Array(maxCols).fill(0);
                    const grids = [];
                    rows.forEach(([, rowPath]) => {
                        const [...cells] = Editor.nodes(editor, {
                            at: rowPath,
                            match: n => n.type === 'table-cell',
                        });
                        for(let i = 0, j = 0; i < deposit.length;) {
                            if (deposit[i] === 0) {
                                if (cells[j]) {
                                    const [cellElement, cellPath] = cells[j];
                                    const rowSpan = Number(cellElement.rowSpan || 1);
                                    const colSpan = Number(cellElement.colSpan || 1);
                                    grids.push({
                                        element: cellElement,
                                        path: cellPath,
                                        offset: i,
                                        row: rowPath[rowPath.length - 1],
                                        colSpan,
                                        rowSpan,
                                    });
                                    j++;
                                    for (let k = 0; k < colSpan; k++) {
                                        deposit[i] = rowSpan - 1;
                                        i++;
                                    }
                                } else {
                                    i++;
                                }
                            } else {
                                deposit[i]--;
                                i++;
                            }
                        }
                    });
                    const startGrid = grids.find(item => item.path.toString() === startPath.toString());
                    const endGrid = grids.find(item => item.path.toString() === endPath.toString());
                    let minOffset = startGrid.offset > endGrid.offset ? endGrid.offset : startGrid.offset,
                        maxOffset = startGrid.offset + startGrid.colSpan > endGrid.offset + endGrid.colSpan ? startGrid.offset + startGrid.colSpan : endGrid.offset + endGrid.colSpan,
                        minRow = startGrid.row > endGrid.row ? endGrid.row : startGrid.row,
                        maxRow = startGrid.row + startGrid.rowSpan > endGrid.row + endGrid.rowSpan ? startGrid.row + startGrid.rowSpan : endGrid.row + endGrid.rowSpan;
                    let flag = true, selectedGrids = [];
                    while(flag && selectedGrids.length < grids.length) {
                        const _selectedGrids = grids.filter(item => item.offset >= minOffset && item.offset < maxOffset && item.row >= minRow && item.row < maxRow);
                        _selectedGrids.forEach(({ offset, row, colSpan, rowSpan }) => {
                            minOffset = minOffset > offset ? offset : minOffset;
                            maxOffset = maxOffset > offset + colSpan ? maxOffset : offset + colSpan;
                            minRow = minRow > row ? row : minRow;
                            maxRow = maxRow > row + rowSpan ? maxRow : row + rowSpan;
                        });
                        if (_selectedGrids.length === selectedGrids.length) flag = false;
                        selectedGrids = _selectedGrids;
                    }
                    return selectedGrids.map(item => [item.element, item.path]);
                }
            }
        }
        return [];
    },
    cancelSelectedTableCells(editor, table) {
        if (table) {
            const [, tablePath] = table;
            Transforms.setNodes(editor, {
                pathSelection: null,
                selectedFlag: false,
            }, {
                at: tablePath,
            })
        }
    },
};

const insertTableRow = (editor, { maxCols, row }) => {
    const [rowElement, rowPath] = row;
    const currentCols = rowElement.children.filter(item => item.type === 'table-cell').reduce((total, item) => total + (Number(item.colSpan) || 1), 0);
    Transforms.insertNodes(editor, createTableRowElement(currentCols), {
        at: rowPath,
    });
    for (let i = currentCols; i < maxCols; i++) {
        const maxCount = 1000;
        let count = 0;
        let rowSpan = 2;
        let currentPath = rowPath;
        while(currentPath && count < maxCount) {
            const prevRow = Editor.previous(editor, {
                at: currentPath,
                match: n => n.type === 'table-row',
            });
            if (prevRow) {
                const [, path] = prevRow;
                const [cell] = Editor.nodes(editor, {
                    at: path,
                    match: n => n.type === 'table-cell' && n.rowSpan >= rowSpan,
                });
                if (cell) {
                    const [cellElement, cellPath] = cell;
                    Transforms.setNodes(editor, {
                        rowSpan: cellElement.rowSpan + 1,
                    }, {
                        at: cellPath,
                    });
                    currentPath = null;
                } else {
                    currentPath = path;
                    rowSpan++;
                }
            } else {
                currentPath = null;
                console.error('没有找到上一个节点');
            }
            count++;
        }
    }
};

const insertTableCol = (editor, mode = 'left') => {
    const { selection } = editor;
    if (selection) {
        const [table] = Editor.nodes(editor, {
            match: n => n.type === 'table',
        });
        if (table) {
            const [, tablePath] = table;
            const [...rows] = Editor.nodes(editor, {
                at: tablePath,
                match: n => n.type === 'table-row',
            });
            const [currentCell] = Editor.nodes(editor, {
                match: n => n.type === 'table-cell',
            });
            const [currentRow] = Editor.nodes(editor, {
                match: n => n.type === 'table-row',
            });
            if (currentCell && currentRow) {
                const [, currentCellPath] = currentCell;
                const colPath = mode === 'left' ? currentCellPath.pop() : currentCellPath.pop() + 1; // 要插入单元格横向的路径
                const [, currentRowPath] = currentRow;
                const [...currentRowCells] = Editor.nodes(editor, {
                    at: currentRowPath,
                    match: n => n.type === 'table-cell',
                });
                const colSpans = currentRowCells.reduce((total, [element, path]) => { // 当前单元格之前的总格数
                    if (path.pop() < colPath) return total + Number(element.colSpan || 1);
                    return total;
                }, 0);
                rows.forEach(([, path]) => {
                    if (colSpans > 0) {
                        const [...cells] = Editor.nodes(editor, {
                            at: path,
                            match: n => n.type === 'table-cell',
                        });
                        let spans = 0; // 循环当前行返回值之前的总格数
                        const cell = cells.find(([cellElement]) => {
                            spans += Number(cellElement.colSpan || 1);
                            return spans >= colSpans;
                        });
                        if (cell) {
                            const [cellElement, cellPath] = cell;
                            if (spans > colSpans) {
                                Transforms.setNodes(editor, {
                                    colSpan: Number(cellElement.colSpan || 1) + 1,
                                }, {
                                    at: cellPath,
                                });
                            } else {
                                cellPath.push(cellPath.pop() + 1);
                                Transforms.insertNodes(editor, createTableCellElement(), {
                                    at: cellPath,
                                });
                            }
                        }
                    } else {
                        path.push(colPath)
                        Transforms.insertNodes(editor, createTableCellElement(), {
                            at: path,
                        });
                    }
                });
            }
        }
    }
}
