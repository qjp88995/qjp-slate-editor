import React from 'react';

export const Checkbox = props => {
    const { children, attributes, element } = props;
    return (
        <label>
            <input type="checkbox" {...attributes} />
            {children}
        </label>
    );
}

export const Radio = props => {
    const { children, attributes, element } = props;
    return (
        <label>
            <input type="radio" {...attributes} />
            {children}
        </label>
    );
}

export const Input = props => {
    const { children, attributes, element } = props;
    return (
        <label>
            <input type="text" {...attributes} />
            {children}
        </label>
    );
}

export const Textarea = props => {
    const { children, attributes, element } = props;
    return (
        <label>
            <textarea {...attributes} />
            {children}
        </label>
    );
}