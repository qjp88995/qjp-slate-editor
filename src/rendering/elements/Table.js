import React, { useEffect, useState } from 'react';
import { css } from 'emotion';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';
import { MyEditor } from '../../helpers/MyEditor';

const tableSelectionChange = new Event('tableSelectionChange');

class TableSelection {
    constructor() {
        this._editor = null;
        this._table = null;
        this._selection = null;
        this._flag = false;
    }

    set editor(editor) {
        this._editor = editor;
        document.dispatchEvent(tableSelectionChange);
    }

    get editor() {
        return this._editor;
    }

    set table(table) {
        this._table = table;
        document.dispatchEvent(tableSelectionChange);
    }

    get table() {
        return this._table;
    }

    set selection(selection) {
        this._selection = selection;
        document.dispatchEvent(tableSelectionChange);
    }

    get selection() {
        return this._selection;
    }

    set flag(flag) {
        this._flag = flag;
        document.dispatchEvent(tableSelectionChange);
    }

    get flag() {
        return this._flag;
    }

    clear = () => {
        if (this._editor && this._table) {
            Transforms.setNodes(this._editor, {
                mergeCells: false,
            }, {
                at: this._table[1],
            });
        }
        this._editor = null;
        this._table = null;
        this._selection = null;
        this._flag = false;
        document.dispatchEvent(tableSelectionChange);
    }
}

export const tableSelection = new TableSelection();

export const Table = props => {
    let timer = null;
    const editor = useSlate();
    const { children, attributes, element } = props;
    const onMouseLeave = e => {
        const [myTable] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        const { table, flag } = tableSelection;
        if (table && myTable && myTable[0] === table[0] && flag) {
            console.log(123)
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
        display: inline-table;
        width: 80%;
        vertical-align: middle;
        border: 1px solid #ccc;
        border-collapse: collapse;
        border-spacing: 0;
        & tr,& td {
            border: 1px solid #ccc;
        }
        & td {
            padding: 5px;
        }
    `;
    const isEmpty = !Array.isArray(element.children) || !element.children.some(item => item.type === 'table-row');
    return (
        <table {...attributes} className={className} onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter}>
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
        return () => {
            document.removeEventListener('tableSelectionChange', onTableSelectionChange);
        }
    })
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
    const style = {
        background: selected ? '#edf5fa' : 'inherit',
        userSelect: selected ? 'none' : 'auto',
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
                        // e.preventDefault();
                        // e.stopPropagation();
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
                        e.preventDefault();
                        tableSelection.selection = [selection[0], cellPath];
                        tableSelection.flag = false;
                        Transforms.setNodes(editor, {
                            mergeCells: true,
                        }, {
                            at: table[1],
                        });
                    } else {
                        tableSelection.clear();
                    }
                }
            }
        }
    }
    return (
        <td {...attributes} colSpan={colSpan} rowSpan={rowSpan} style={style} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>{children}</td>
    );
};
