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
            return getElement('table', new Array(tableRow).fill(null).map(() => getElement(
                'table-row',
                new Array(tableCol).fill(null).map(() => getElement('table-cell', [
                    getElement('paragraph', [getText()]),
                ])))
            ));
        default:
            return getElement(type, [getText()]);
    }
}