import React, { useMemo, useState, useCallback } from 'react';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Toolbar, MarkButton, BlockButton, CreateTableButton } from './components';
import Element from './element';
import withTables from './customEditor/withTables';
import Leaf from './leaf';
import { onKeyDown } from './handles';
import './styles.module.css';

const emptyValue = [{ type: 'p', children: [{ text: '' }] }];

const App = props => {
    const { initialValue } = props;
    const [value, setValue] = useState(initialValue||emptyValue)
    const renderElement = useCallback((props) => <Element {...props} />, [])
    const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
    const editor = useMemo(
        () => withTables(withHistory(withReact(createEditor()))),
        []
    )
    const onChange = (value) => {
        setValue(value)
    }

    return (
        <Slate editor={editor} value={value} onChange={onChange}>
            <Toolbar>
                <MarkButton format='bold' icon='format_bold' title='粗体' />
                <MarkButton format='italic' icon='format_italic' title='斜体' />
                <MarkButton format='underline' icon='format_underlined' title='下划线' />
                <MarkButton format='code' icon='code' title='代码' />
                <BlockButton format='h1' icon='looks_one' title='一级标题' />
                <BlockButton format='h2' icon='looks_two' title='二级标题' />
                <BlockButton format='h3' icon='looks_3' title='三级标题' />
                <BlockButton format='h4' icon='looks_4' title='四级标题' />
                <BlockButton format='h5' icon='looks_5' title='五级标题' />
                <BlockButton format='h6' icon='looks_6' title='六级标题' />
                <BlockButton format='blockquote' icon='format_quote' title='引用' />
                <BlockButton format='ol' icon='format_list_numbered' title='有序列表' />
                <BlockButton format='ul' icon='format_list_bulleted' title='无序列表' />
                <CreateTableButton icon='table_chart' title='表格' />
            </Toolbar>
            <Editable
                className="qjp-slate-editor"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder='Enter some rich text…'
                spellCheck
                autoFocus
                onKeyDown={onKeyDown}
            />
        </Slate>
    )
}

export default App
