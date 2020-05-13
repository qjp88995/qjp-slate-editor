import React from 'react';

const P = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <p ref={ref} {...attributes}>{children}</p>
    )
});

export default P;