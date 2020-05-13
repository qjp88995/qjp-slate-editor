import React from 'react';

export const H1 = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <h1 ref={ref} {...attributes}>{children}</h1>
    )
});

export const H2 = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <h2 ref={ref} {...attributes}>{children}</h2>
    )
});

export const H3 = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <h3 ref={ref} {...attributes}>{children}</h3>
    )
});

export const H4 = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <h4 ref={ref} {...attributes}>{children}</h4>
    )
});

export const H5 = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <h5 ref={ref} {...attributes}>{children}</h5>
    )
});

export const H6 = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <h6 ref={ref} {...attributes}>{children}</h6>
    )
});