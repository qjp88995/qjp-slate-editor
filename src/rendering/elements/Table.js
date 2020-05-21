import React, { useEffect, useState } from 'react';
import { css } from 'emotion';
import { useSlate } from 'slate-react';
import { Transforms } from 'slate';
import { MyEditor } from '../../helpers/MyEditor';


export const Table = props => {
    const editor = useSlate();
    const { children, attributes, element } = props;
    const onMouseLeave = e => {
        const [table] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        if (table) {
            const [tableElement, tablePath] = table;
            const { selectedFlag } = tableElement;
            if (selectedFlag) {
                Transforms.setNodes(editor, {
                    pathSelection: null,
                    selectedFlag: false,
                }, {
                    at: tablePath,
                });
            }
        }
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
        <table {...attributes} className={className} onMouseLeave={onMouseLeave}>
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
    const editor = useSlate();
    const { children, attributes, element } = props;
    const { colSpan = 1, rowSpan = 1 } = element;
    const isSelected = () => {
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
                const [tableElement] = table;
                const { pathSelection } = tableElement;
                if (pathSelection && pathSelection[0] && pathSelection[1]) {
                    const selectedCells = MyEditor.getSelectedTableCells(editor, table);
                    return selectedCells.some(([, path]) => path.toString() === cellPath.toString());
                }
            }
        }
        return false;
    }
    const style = {
        background: isSelected() ? '#edf5fa' : 'inherit',
        userSelect: isSelected() ? 'none' : 'auto',
    }
    const onMouseDown = e => {
        const [cell] = MyEditor.nodes(editor, {
            at: [],
            match: n => n === element,
        });
        const [...tables] = MyEditor.nodes(editor, {
            at: [],
            match: n => n.type === 'table',
        });
        tables.forEach(item => {
            MyEditor.cancelSelectedTableCells(editor, item);
        });
        if (cell) {
            const [, cellPath] = cell;
            const [table] = MyEditor.nodes(editor, {
                at: cellPath,
                match: n => n.type === 'table',
            });
            if (table) {
                const [, tablePath] = table;
                Transforms.setNodes(editor, {
                    pathSelection: [cellPath, cellPath],
                    selectedFlag: true,
                }, {
                    at: tablePath,
                });
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
            const [table] = MyEditor.nodes(editor, {
                at: cellPath,
                match: n => n.type === 'table',
            });
            if (table) {
                const [tableElement, tablePath] = table;
                const { pathSelection, selectedFlag } = tableElement;
                if (pathSelection && selectedFlag) {
                    if (cellPath.toString() !== pathSelection[1].toString()) {
                        Transforms.setNodes(editor, {
                            pathSelection: [pathSelection[0], cellPath],
                        }, {
                            at: tablePath,
                        });
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
            const [table] = MyEditor.nodes(editor, {
                at: cellPath,
                match: n => n.type === 'table',
            });
            if (table) {
                const [tableElement, tablePath] = table;
                const { pathSelection, selectedFlag } = tableElement;
                if (selectedFlag) {
                    Transforms.setNodes(editor, {
                        pathSelection: [pathSelection[0], cellPath],
                        selectedFlag: false,
                    }, {
                        at: tablePath,
                    });
                }
            }
        }
    }
    return (
        <td {...attributes} colSpan={colSpan} rowSpan={rowSpan} style={style} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}>{children}</td>
    );
};
