import React from 'react';
import { css } from 'emotion';

export const Table = props => {
    const { children, attributes, element } = props;
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
    return (
        <table {...attributes} className={className}>
            <tbody>{children}</tbody>
        </table>
    );
};

export const TableRow = props => {
    const { children, attributes, element } = props;
    return (
        <tr {...attributes}>{children}</tr>
    );
};

export const TableCell = props => {
    const { children, attributes, element } = props;
    const { colSpan = 1, rowSpan = 1 } = element;
    const style = {
        background: !element.selected ? 'inherit' : '#edf5fa',
    }
    return (
        <td {...attributes} colSpan={colSpan} rowSpan={rowSpan} style={style}>{children}</td>
    );
};
