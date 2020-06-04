import React, { useEffect, useState } from 'react';
import { css } from 'emotion';
import { useSlate } from 'slate-react';
import { Transforms, Range } from 'slate';
import { MyEditor } from '../../helpers/MyEditor';
import { tableSelection } from './tableSelection';
import { tableResize } from './tableResize';
import { eventManager } from '../../handles';

const globalMouseMove = (event, editor) => {
    if (tableResize.table && tableResize.flag) {
        tableResize.endXy = [event.pageX, event.pageY];
    }
}

eventManager.register({ type: 'editorMouseMove', event: globalMouseMove});

const globalMouseUp = (event, editor) => {
    const { selection } = editor;
    if (!selection) {
        if (tableSelection.table && tableSelection.selection && !tableSelection.flag) {
            const [firstCell] = MyEditor.getSelectedTableCells(editor);
            const [, firstCellPath] = firstCell;
            const point = MyEditor.point(editor, firstCellPath, { edge: 'start' });
            Transforms.select(editor, { anchor: point, focus: point });
        }
    }
    if (tableResize.table && tableResize.flag) {
        tableResize.endXy = [event.pageX, event.pageY];
        MyEditor.resizeTable(editor);
    }
}

eventManager.register({ type: 'editorMouseUp', event: globalMouseUp });

export const Table = props => {
    const [tempWidths, setTempWidths] = useState([]);

    let timer = null;
    const editor = useSlate();
    const { children, attributes, element } = props;

    
    useEffect(() => {
        const resize = () => {
            const { table, flag, startXy, endXy, grid, type } = tableResize;
            if (table && flag && table[0] === element) {
                if (type === 'width') {
                    const { offset, colSpan } = grid;
                    const widths = [];
                    for (let i = 0; i < colSpan; i++) {
                        widths.push([offset + i, endXy[0] - startXy[0]]);
                    }
                    return setTempWidths(widths);
                }
            }
            return setTempWidths([]);
        }
        document.addEventListener('tableResizeChange', resize);
        return () => document.removeEventListener('tableResizeChange', resize);
    }, [element]);
    
    useEffect(() => {
        const clearTableSelection = (event, editor) => {
            const { selection } = editor;
            if (selection && Range.isCollapsed(selection)) {
                const [table] = MyEditor.nodes(editor, {
                    match: n => n === element,
                });
                if (!table) {
                    tableSelection.clear();
                }
            }
        }
        const key = eventManager.register({ type: 'editorMouseUp', event: clearTableSelection });
        return () => eventManager.remove(key);
    }, [element]);

    const onMouseLeave = e => {
        const [myTable] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        const { table, flag } = tableSelection;
        if (table && myTable && myTable[0] === table[0] && flag) {
            timer = setTimeout(() => {
                tableSelection.clear();
                timer = null;
            }, 500);
        }
    }
    const onMouseEnter = e => {
        if (timer) clearTimeout(timer);
    }

    const className = css`
        vertical-align: middle;
        border: 1px solid #ccc;
        border-collapse: collapse;
        border-spacing: 0;
        & tr,& td {
            border: 1px solid #ccc;
        }
        & td {
            position: relative;
            padding: 5px;
            & .resize-div {
                position: absolute;
                right: -2px;
                top: 0;
                bottom: 0;
                width: 4px;
                background: red;
                cursor: w-resize;
                z-index: 1000;
            }
        }
    `;
    const isEmpty = !Array.isArray(element.children) || !element.children.some(item => item.type === 'table-row');
    const maxCols = isEmpty ? 0 : element.children[0].children.filter(item => item.type === 'table-cell').reduce((total, item) => total + Number(item.colSpan || 1), 0);
    const cols = element.cols ? [...element.cols] : new Array(maxCols).fill({ width: 200 });
    return (
        <table {...attributes} className={className} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
            <colgroup contentEditable={false}>
                {
                    cols.map((item, index) => {
                        const { width } = item;
                        const key = `col${index, index}`;
                        const changeWidth = tempWidths.find(it => it[0] === index);
                        const _width = changeWidth ? width + changeWidth[1] : width;
                        return ( <col key={key} span={1} style={{ width: _width > 20 ? _width : 20 }} /> );
                    })
                }
            </colgroup>
            <tbody>{!isEmpty && children}</tbody>
        </table>
    );
};

export const TableRow = props => {
    const { children, attributes, element } = props;
    const isEmpty = !Array.isArray(element.children) || !element.children.some(item => item.type === 'table-cell');
    return (
        <tr {...attributes}>
            {!isEmpty && children}
        </tr>
    );
};

export const TableCell = props => {
    const [selected, setSelected] = useState(false);
    const editor = useSlate();
    const { children, attributes, element } = props;
    const { colSpan = 1, rowSpan = 1 } = element;

    const onTableSelectionChange = () => {
        setSelected(isSelected());
    }

    useEffect(() => {
        document.addEventListener('tableSelectionChange', onTableSelectionChange);
        return () => document.removeEventListener('tableSelectionChange', onTableSelectionChange);
    }, [])

    const isSelected = () => {
        const [cell] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        if (cell) {
            const [, cellPath] = cell;
            const [myTable] = MyEditor.nodes(editor, {
                at: cellPath,
                match: n => n.type === 'table',
            });
            const { selection, table } = tableSelection;
            if (myTable && table && myTable[0] === table[0]) {
                if (selection && selection[0] && selection[1]) {
                    const selectedCells = MyEditor.getSelectedTableCells(editor);
                    return selectedCells.some(([, path]) => path.toString() === cellPath.toString());
                }
            }
        }
        return false;
    }
    const onMouseDown = e => {
        const [cell] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        if (cell) {
            const [, cellPath] = cell;
            const [table] = MyEditor.nodes(editor, {
                at: cellPath,
                match: n => n.type === 'table',
            });
            if (table) {
                tableSelection.editor = editor;
                tableSelection.table = table;
                tableSelection.selection = [cellPath, cellPath];
                tableSelection.flag = true;
            }
        }
    }
    const onMouseMove = e => {
        const [cell] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        if (cell) {
            const [, cellPath] = cell;
            const [myTable] = MyEditor.nodes(editor, {
                at: cellPath,
                match: n => n.type === 'table',
            });
            const { selection, flag, table } = tableSelection;
            if (myTable && table && myTable[0] === table[0]) {
                if (selection && flag) {
                    if (selection[0].toString() !== selection[1].toString()) {
                        Transforms.deselect(editor);
                    }
                    if (cellPath.toString() !== selection[1].toString()) {
                        tableSelection.selection = [selection[0], cellPath];
                    }
                }
            }
        }
    }
    const onMouseUp = e => {
        const [cell] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        if (cell) {
            const [, cellPath] = cell;
            const [myTable] = MyEditor.nodes(editor, {
                at: cellPath,
                match: n => n.type === 'table',
            });
            const { selection, flag, table } = tableSelection;
            if (myTable && table && table[0] === myTable[0]) {
                if (flag) {
                    if (selection[0].toString() !== cellPath.toString()) {
                        tableSelection.selection = [selection[0], cellPath];
                        tableSelection.flag = false;
                    } else {
                        tableSelection.clear();
                    }
                }
            }
        }
    }
    const onResizeMouseDown = e => {
        e.preventDefault();
        e.stopPropagation();
        const [cell] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        if (cell) {
            const [, cellPath] = cell;
            const [myTable] = MyEditor.nodes(editor, {
                at: cellPath,
                match: n => n.type === 'table',
            });
            if (myTable) {
                const grids = MyEditor.getTableGrids(editor, myTable);
                tableResize.table = myTable;
                tableResize.grid = grids.find(item => item.path.toString() === cellPath.toString());
                if (tableResize.grid) {
                    tableResize.flag = true;
                    tableResize.type = 'width';
                    tableResize.startXy = [e.pageX, e.pageY];
                    tableResize.endXy = [e.pageX, e.pageY];
                } else {
                    tableResize.clear();
                }
            }
        }
    }
    return (
        <td
            {...attributes}
            style={{ background: selected ? '#edf5fa' : 'inherit' }}
            colSpan={colSpan}
            rowSpan={rowSpan}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        >
            <div className="resize-div" contentEditable={false} onMouseDown={onResizeMouseDown} />
            {children}
        </td>
    );
};
