import React from 'react';
import Blockquote from './Blockquote';
import { H1, H2, H3, H4, H5, H6 } from './Heading';
import { Ul, Ol, Li } from './List';
import { Table, Thead, Tbody, Tfoot, Tr, Td, Th, TableWrap, TableBefore, TableAfter } from './Table';
import P from './P';

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'blockquote':
            return <Blockquote {...attributes}>{children}</Blockquote>
        case 'h1':
            return <H1 {...attributes}>{children}</H1>
        case 'h2':
            return <H2 {...attributes}>{children}</H2>
        case 'h3':
            return <H3 {...attributes}>{children}</H3>
        case 'h4':
            return <H4 {...attributes}>{children}</H4>
        case 'h5':
            return <H5 {...attributes}>{children}</H5>
        case 'h6':
            return <H6 {...attributes}>{children}</H6>
        case 'ul':
            return <Ul {...attributes}>{children}</Ul>
        case 'ol':
            return <Ol {...attributes}>{children}</Ol>
        case 'li':
            return <Li {...attributes}>{children}</Li>
        case 'tableWrap':
            return <TableWrap {...attributes}>{children}</TableWrap>
        case 'tableBefore':
            return <TableBefore {...attributes}>{children}</TableBefore>
        case 'tableAfter':
            return <TableAfter {...attributes}>{children}</TableAfter>
        case 'table':
            return <Table {...attributes}>{children}</Table>
        case 'thead':
            return <Thead {...attributes}>{children}</Thead>
        case 'tbody':
            return <Tbody {...attributes}>{children}</Tbody>
        case 'tfoot':
            return <Tfoot {...attributes}>{children}</Tfoot>
        case 'tr':
            return <Tr {...attributes}>{children}</Tr>
        case 'th':
            return <Th {...attributes}>{children}</Th>
        case 'td':
            return <Td {...attributes}>{children}</Td>
        default:
            return <P {...attributes}>{children}</P>
    }
}

export default Element;