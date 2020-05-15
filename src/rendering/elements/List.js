import React from 'react';

export const BulletedList = props => {
    const { children, attributes, element } = props;
    return (
        <ul {...attributes}>{children}</ul>
    )
};

export const NumberedList = props => {
    const { children, attributes, element } = props;
    return (
        <ol {...attributes}>{children}</ol>
    )
};

export const ListItem = props => {
    const { children, attributes, element } = props;
    return (
        <li {...attributes}>{children}</li>
    )
};