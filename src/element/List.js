import React from 'react';

export const Ul = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <ul ref={ref} {...attributes}>{children}</ul>
    )
});

export const Ol = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <ol ref={ref} {...attributes}>{children}</ol>
    )
});

export const Li = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <li ref={ref} {...attributes}>{children}</li>
    )
});