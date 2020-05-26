import React from 'react';
import Blockquote from './Blockquote';
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from './Heading';
import { NumberedList, BulletedList, ListItem } from './List';
import { Table, TableRow, TableCell } from './Table';
import Default from './Default';
import { Checkbox, Radio, Input, Textarea } from './Input';

export const elements = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'blockquote':
            return <Blockquote attributes={attributes} element={element}>{children}</Blockquote>
        case 'heading-1':
            return <Heading1 attributes={attributes} element={element}>{children}</Heading1>
        case 'heading-2':
            return <Heading2 attributes={attributes} element={element}>{children}</Heading2>
        case 'heading-3':
            return <Heading3 attributes={attributes} element={element}>{children}</Heading3>
        case 'heading-4':
            return <Heading4 attributes={attributes} element={element}>{children}</Heading4>
        case 'heading-5':
            return <Heading5 attributes={attributes} element={element}>{children}</Heading5>
        case 'heading-6':
            return <Heading6 attributes={attributes} element={element}>{children}</Heading6>
        case 'numbered-list':
            return <NumberedList attributes={attributes} element={element}>{children}</NumberedList>
        case 'bulleted-list':
            return <BulletedList attributes={attributes} element={element}>{children}</BulletedList>
        case 'list-item':
            return <ListItem attributes={attributes} element={element}>{children}</ListItem>
        case 'table':
            return <Table attributes={attributes} element={element}>{children}</Table>
        case 'table-row':
            return <TableRow attributes={attributes} element={element}>{children}</TableRow>
        case 'table-cell':
            return <TableCell attributes={attributes} element={element}>{children}</TableCell>
        case 'checkbox':
            return <Checkbox attributes={attributes} element={element}>{children}</Checkbox>
        case 'radio':
            return <Radio attributes={attributes} element={element}>{children}</Radio>
        case 'input':
            return <Input attributes={attributes} element={element}>{children}</Input>
        case 'textarea':
            return <Textarea attributes={attributes} element={element}>{children}</Textarea>
        default:
            return <Default attributes={attributes} element={element}>{children}</Default>
    }
}