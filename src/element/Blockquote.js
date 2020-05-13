import React from 'react';

const Blockquote = React.forwardRef((props, ref) => {
    const { children, ...attributes } = props;
    return (
        <blockquote ref={ref} {...attributes}>{children}</blockquote>
    )
});

export default Blockquote;