import React from 'react'
import SlateEditor from 'qjp-slate-editor'

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
        type: 'table',
        children: [
            {
                type: 'table-row',
                children: [
                    {
                        type: 'table-cell',
                        rowSpan: 1,
                        children: [
                            {
                                type: 'paragraph',
                                children: [
                                    { text: '' }
                                ]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: 'Human', bold: true }]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: 'Dog', bold: true }]
                            }
                        ]
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
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: '# of Feet', bold: true }]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: '2' }]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: '4' }]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: '4' }]
                            }
                        ]
                    }
                ]
            },
            {
                type: 'table-row',
                children: [
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: '# of Lives', bold: true }]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        rowSpan: 1,
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: '1' }]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: '1' }]
                            }
                        ]
                    },
                    {
                        type: 'table-cell',
                        children: [
                            {
                                type: 'paragraph',
                                children: [{ text: '9' }]
                            }
                        ]
                    }
                ]
            }
        ],
    },
    {
        type: 'paragraph',
        children: [{ text: '' }]
    },
]

const App = () => {
    return <SlateEditor initialValue={initialValue} />
}

export default App
