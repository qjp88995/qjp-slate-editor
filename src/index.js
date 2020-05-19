import React, { useMemo, useState, useCallback } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { css } from 'emotion';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, CodeOutlined, OrderedListOutlined, UnorderedListOutlined, TableOutlined, MergeCellsOutlined, SplitCellsOutlined, InsertRowAboveOutlined, InsertRowBelowOutlined, InsertRowLeftOutlined, InsertRowRightOutlined } from '@ant-design/icons';
import { Toolbar, MarkButton, BlockButton, CreateTableButton } from './components';
import { elements, leaves } from './rendering';
import { withTables } from './plugins';
import { editableKeyDown, editableClick } from './handles';
import './styles.module.css';

const emptyValue = [{ type: 'paragraph', children: [{ text: '' }] }];

const App = props => {
    const { initialValue } = props;
    const [value, setValue] = useState(initialValue||emptyValue)
    const renderElement = useCallback(elements, [])
    const renderLeaf = useCallback(leaves, [])
    const editor = useMemo(
        () => withTables(withHistory(withReact(createEditor()))),
        []
    )
    const onChange = (value) => {
        setValue(value)
    }

    const onKeyDown = e => editableKeyDown(e, editor);

    const onClick = e => editableClick(e, editor);

    return (
        <Slate editor={editor} value={value} onChange={onChange}>
            <Toolbar>
                <MarkButton format='bold' icon={(<BoldOutlined />)} title='粗体' />
                <MarkButton format='italic' icon={(<ItalicOutlined />)} title='斜体' />
                <MarkButton format='underline' icon={(<UnderlineOutlined />)} title='下划线' />
                <MarkButton format='code' icon={(<CodeOutlined />)} title='代码' />
                <BlockButton format='heading-1' icon='H1' title='一级标题' />
                <BlockButton format='heading-2' icon='H2' title='二级标题' />
                <BlockButton format='heading-3' icon='H3' title='三级标题' />
                <BlockButton format='heading-4' icon='H4' title='四级标题' />
                <BlockButton format='heading-5' icon='H5' title='五级标题' />
                <BlockButton format='heading-6' icon='H6' title='六级标题' />
                <BlockButton format='blockquote' icon='引用' title='引用' />
                <BlockButton format='numbered-list' icon={(<OrderedListOutlined />)} title='有序列表' />
                <BlockButton format='bulleted-list' icon={(<UnorderedListOutlined />)} title='无序列表' />
                <CreateTableButton icon={(<TableOutlined />)} title='表格' />
                <BlockButton format='table-cell-merge' icon={(<MergeCellsOutlined />)} title='合并单元格' />
                <BlockButton format='table-cell-split' icon={(<SplitCellsOutlined />)} title='拆分单元格' />
                <BlockButton format='table-row-insert-up' icon={(<InsertRowAboveOutlined />)} title='向上插入行' />
                <BlockButton format='table-row-insert-down' icon={(<InsertRowBelowOutlined />)} title='向下插入行' />
                <BlockButton format='table-col-insert-left' icon={(<InsertRowLeftOutlined />)} title='向左插入列' />
                <BlockButton format='table-col-insert-right' icon={(<InsertRowRightOutlined />)} title='向右插入列' />
            </Toolbar>
            <Editable
                className={css`height: 600px; overflow: auto; padding: 10px;`}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder='Enter some rich text…'
                spellCheck
                autoFocus
                onKeyDown={onKeyDown}
                onClick={onClick}
            />
        </Slate>
    )
}

export default App
