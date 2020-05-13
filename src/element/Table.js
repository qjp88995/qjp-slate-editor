import React from 'react';
import { css } from 'emotion';

export const TableWrap = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    const className = css`
        margin: 10px 0;
    `;
    return (
        <div ref={ref} {...attributes} className={className}>{children}</div>
    );
});

export const TableBefore = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    const className = css`
        display: inline-block;
        vertical-align: middle;
    `;
    return (
        <div ref={ref} {...attributes} className={className}>{children}</div>
    );
});

export const TableAfter = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    const className = css`
        display: inline-block;
        vertical-align: middle;
    `;
    return (
        <div ref={ref} {...attributes} className={className}>{children}</div>
    );
});

export const Table = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    const className = css`
        display: inline-table;
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
        <table ref={ref} {...attributes} className={className}>{children}</table>
    );
});

export const Thead = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <thead ref={ref} {...attributes}>{children}</thead>
    );
});

export const Tbody = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <tbody ref={ref} {...attributes}>{children}</tbody>
    );
});

export const Tfoot = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <tfoot ref={ref} {...attributes}>{children}</tfoot>
    );
});

export const Tr = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <tr ref={ref} {...attributes}>{children}</tr>
    );
});

export const Th = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <th ref={ref} {...attributes}>{children}</th>
    );
});

export const Td = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <td ref={ref} {...attributes}>{children}</td>
    );
});
