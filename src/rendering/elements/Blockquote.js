import React from 'react';

const Blockquote = props => {
    const { children, attributes, element } = props;
    return (
        <blockquote {...attributes}>{children}</blockquote>
    )
};

export default Blockquote;