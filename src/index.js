import React, { useMemo, useState, useCallback } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { css } from 'emotion';
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
                <MarkButton format='bold' icon='format_bold' title='粗体' />
                <MarkButton format='italic' icon='format_italic' title='斜体' />
                <MarkButton format='underline' icon='format_underlined' title='下划线' />
                <MarkButton format='code' icon='code' title='代码' />
                <BlockButton format='heading-1' icon='looks_one' title='一级标题' />
                <BlockButton format='heading-2' icon='looks_two' title='二级标题' />
                <BlockButton format='heading-3' icon='looks_3' title='三级标题' />
                <BlockButton format='heading-4' icon='looks_4' title='四级标题' />
                <BlockButton format='heading-5' icon='looks_5' title='五级标题' />
                <BlockButton format='heading-6' icon='looks_6' title='六级标题' />
                <BlockButton format='blockquote' icon='format_quote' title='引用' />
                <BlockButton format='numbered-list' icon='format_list_numbered' title='有序列表' />
                <BlockButton format='bulleted-list' icon='format_list_bulleted' title='无序列表' />
                <CreateTableButton icon='table_chart' title='表格' />
            </Toolbar>
            <Editable
                className={css`height: 600px; overflow: auto;`}
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
