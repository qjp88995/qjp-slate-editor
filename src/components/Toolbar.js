import React from 'react';
import { cx, css } from 'emotion';
import { Menu } from './Menu';

export const Toolbar = React.forwardRef(({ className, ...props }, ref) => (
    <Menu
        {...props}
        ref={ref}
        className={cx(
            className,
            css`
                position: relative;
                padding: 17px 18px;
                border-bottom: 2px solid #eee;
            `
        )}
    />
));
