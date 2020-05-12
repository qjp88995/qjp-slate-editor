import React from 'react';
import { cx, css } from 'emotion';
import 'material-icons';

export const Icon = React.forwardRef(({ className, ...props }, ref) => (
    <span
        {...props}
        ref={ref}
        className={cx(
            'material-icons',
            className,
            css`
                font-size: 18px;
                vertical-align: text-bottom;
            `
        )}
    />
));
