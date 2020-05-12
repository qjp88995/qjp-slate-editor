import React, { useMemo, useState, useCallback } from 'react';
import { Slate, Editable, withReact, useSlate } from 'slate-react';
import { createEditor, Transforms, Editor, Point, Range } from 'slate';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';
import { Button, Icon, Toolbar } from './components';
import './styles.module.css';

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code'
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)

    Transforms.unwrapNodes(editor, {
        match: (n) => LIST_TYPES.includes(n.type),
        split: true
    })

    Transforms.setNodes(editor, {
        type: isActive ? 'paragraph' : isList ? 'list-item' : format
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

const withTables = (editor) => {
    const { deleteBackward, deleteForward, insertBreak } = editor

    editor.deleteBackward = (unit) => {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) => n.type === 'table-cell'
            })

            if (cell) {
                const [, cellPath] = cell
                const start = Editor.start(editor, cellPath)

                if (Point.equals(selection.anchor, start)) {
                    return
                }
            }
        }

        deleteBackward(unit)
    }

    editor.deleteForward = (unit) => {
        const { selection } = editor

        if (selection && Range.isCollapsed(selection)) {
            const [cell] = Editor.nodes(editor, {
                match: (n) => n.type === 'table-cell'
            })

            if (cell) {
                const [, cellPath] = cell
                const end = Editor.end(editor, cellPath)

                if (Point.equals(selection.anchor, end)) {
                    return
                }
            }
        }

        deleteForward(unit)
    }

    editor.insertBreak = () => {
        const { selection } = editor

        if (selection) {
            const [table] = Editor.nodes(editor, { match: (n) => n.type === 'table' })

            if (table) {
                return
            }
        }

        insertBreak()
    }

    return editor
}

const Element = ({ attributes, children, element }) => {
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>
        case 'list-item':
            return <li {...attributes}>{children}</li>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        case 'table':
            return (
                <table>
                    <tbody {...attributes}>{children}</tbody>
                </table>
            )
        case 'table-row':
            return <tr {...attributes}>{children}</tr>
        case 'table-cell':
            return <td {...attributes}>{children}</td>
        default:
            return <p {...attributes}>{children}</p>
    }
}

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.code) {
        children = <code>{children}</code>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.underline) {
        children = <u>{children}</u>
    }

    return <span {...attributes}>{children}</span>
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
                text:
                    "Since it's rich text, you can do things like turn a selection of text "
            },
            { text: 'bold', bold: true },
            {
                text:
                    ', or add a semantically rendered block quote in the middle of the page, like this:'
            }
        ]
    },
    {
        type: 'block-quote',
        children: [{ text: 'A wise quote.' }]
    },
    {
        type: 'paragraph',
        children: [{ text: 'Try it out for yourself!' }]
    },
    {
        type: 'table',
        children: [
            {
                type: 'table-row',
                children: [
                    {
                        type: 'table-cell',
                        children: [{ text: '' }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: 'Human', bold: true }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: 'Dog', bold: true }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: 'Cat', bold: true }]
                    }
                ]
            },
            {
                type: 'table-row',
                children: [
                    {
                        type: 'table-cell',
                        children: [{ text: '# of Feet', bold: true }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: '2' }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: '4' }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: '4' }]
                    }
                ]
            },
            {
                type: 'table-row',
                children: [
                    {
                        type: 'table-cell',
                        children: [{ text: '# of Lives', bold: true }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: '1' }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: '1' }]
                    },
                    {
                        type: 'table-cell',
                        children: [{ text: '9' }]
                    }
                ]
            }
        ]
    }
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
        console.log(value)
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
                <BlockButton format='heading-one' icon='looks_one' title='一级标题' />
                <BlockButton format='heading-two' icon='looks_two' title='二级标题' />
                <BlockButton format='block-quote' icon='format_quote' title='引用' />
                <BlockButton
                    format='numbered-list'
                    icon='format_list_numbered'
                    title='有序列表'
                />
                <BlockButton
                    format='bulleted-list'
                    icon='format_list_bulleted'
                    title='无序列表'
                />
            </Toolbar>
            <Editable
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
