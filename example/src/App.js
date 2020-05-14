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
                                        children: [
                                            {
                                                type: 'p',
                                                children: [
                                                    { text: '' }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: 'Human', bold: true }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: 'Dog', bold: true }]
                                            }
                                        ]
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
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: '# of Feet', bold: true }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: '2' }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: '4' }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: '4' }]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                type: 'tr',
                                children: [
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: '# of Lives', bold: true }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: '1' }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: '1' }]
                                            }
                                        ]
                                    },
                                    {
                                        type: 'td',
                                        children: [
                                            {
                                                type: 'p',
                                                children: [{ text: '9' }]
                                            }
                                        ]
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
    return <SlateEditor initialValue={initialValue} />
}

export default App
