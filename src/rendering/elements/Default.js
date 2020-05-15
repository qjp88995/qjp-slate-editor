import React from 'react';

const Default = props => {
    const { children, attributes, element } = props;
    return (
        <p {...attributes}>{children}</p>
    )
};

export default Default;