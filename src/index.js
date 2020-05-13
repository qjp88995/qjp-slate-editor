import React, { useMemo, useState, useCallback } from 'react';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor, Transforms, Editor } from 'slate';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';
import { Button, Icon, Toolbar } from './components';
import Element from './element';
import withTables from './customEditor/withTables';
import './styles.module.css';
import Leaf from './leaf';

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code'
}

const LIST_TYPES = ['ul', 'ol']

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: (n) => LIST_TYPES.includes(n.type),
        split: true
    })

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'li' : format
    })

    if (!isActive && isList) {
        const block = { type: format, children: [] }
        Transforms.wrapNodes(editor, block)
    }
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)

    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: (n) => n.type === format
    })

    return !!match
}

const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const BlockButton = ({ format, icon, ...props }) => {
    const editor = useSlate()
    return (
        <Button
            {...props}
            active={isBlockActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleBlock(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

const MarkButton = ({ format, icon, ...props }) => {
    const editor = useSlate()
    return (
        <Button
            {...props}
            active={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                toggleMark(editor, format)
            }}
        >
            <Icon>{icon}</Icon>
        </Button>
    )
}

const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is editable ' },
            { text: 'rich', bold: true },
            { text: ' text, ' },
            { text: 'much', italic: true },
            { text: ' better than a ' },
            { text: '<textarea>', code: true },
            { text: '!' }
        ]
    },
    {
        type: 'paragraph',
        children: [
            {
                text: "Since it's rich text, you can do things like turn a selection of text "
            },
            { text: 'bold', bold: true },
            {
                text: ', or add a semantically rendered block quote in the middle of the page, like this:'
            }
        ]
    },
    {
        type: 'blockquote',
        children: [{ text: 'A wise quote.' }]
    },
    {
        type: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }]
    },
    {
        type: 'tableWrap',
        children: [
            {
                type: 'tableBefore',
                children: [{ text: '' }],
            },
            {
                type: 'table',
                children: [
                    {
                        type: 'tbody',
                        children: [
                            {
                                type: 'tr',
                                children: [
                                    {
                                        type: 'td',
                                        children: [{ text: '' }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: 'Human', bold: true }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: 'Dog', bold: true }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: 'Cat', bold: true }]
                                    }
                                ]
                            },
                            {
                                type: 'tr',
                                children: [
                                    {
                                        type: 'td',
                                        children: [{ text: '# of Feet', bold: true }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: '2' }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: '4' }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: '4' }]
                                    }
                                ]
                            },
                            {
                                type: 'tr',
                                children: [
                                    {
                                        type: 'td',
                                        children: [{ text: '# of Lives', bold: true }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: '1' }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: '1' }]
                                    },
                                    {
                                        type: 'td',
                                        children: [{ text: '9' }]
                                    }
                                ]
                            }
                        ]
                    }
                ],
            },
            {
                type: 'tableAfter',
                children: [{ text: '' }],
            },
        ],
    },
]

const App = () => {
    const [value, setValue] = useState(initialValue)
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
                <MarkButton
                    format='underline'
                    icon='format_underlined'
                    title='下划线'
                />
                <MarkButton format='code' icon='code' title='代码' />
                <BlockButton format='h1' icon='looks_one' title='一级标题' />
                <BlockButton format='h2' icon='looks_two' title='二级标题' />
                <BlockButton format='h3' icon='looks_3' title='三级标题' />
                <BlockButton format='h4' icon='looks_4' title='四级标题' />
                <BlockButton format='h5' icon='looks_5' title='五级标题' />
                <BlockButton format='h6' icon='looks_6' title='六级标题' />
                <BlockButton format='blockquote' icon='format_quote' title='引用' />
                <BlockButton
                    format='ol'
                    icon='format_list_numbered'
                    title='有序列表'
                />
                <BlockButton
                    format='ul'
                    icon='format_list_bulleted'
                    title='无序列表'
                />
            </Toolbar>
            <Editable
                className="qjp-slate-editor"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder='Enter some rich text…'
                spellCheck
                autoFocus
                onKeyDown={(event) => {
                    for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event)) {
                            event.preventDefault()
                            const mark = HOTKEYS[hotkey]
                            toggleMark(editor, mark)
                        }
                    }
                }}
            />
        </Slate>
    )
}

export default App
