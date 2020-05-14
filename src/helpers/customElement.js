export const getText = () => {
    return { text: '' };
}

export const getElement = (type, children) => {
    return { type, children }
}

export const customElement = (type, options = {}) => {
    switch(type) {
        case 'table':
            const { tableRow = 0, tableCol = 0 } = options;
            return getElement('tableWrap', [
                getElement('tableBefore', [getText()]),
                getElement('table', [
                    getElement(
                        'tbody',
                        new Array(tableRow).fill(null).map(() => getElement(
                            'tr',
                            new Array(tableCol).fill(null).map(() => getElement('td', [
                                getElement('p', [getText()]),
                            ])))
                        )
                    )
                ]),
                getElement('tableAfter', [getText()]),
            ]);
        default:
            return getElement(type, [getText()]);
    }
}