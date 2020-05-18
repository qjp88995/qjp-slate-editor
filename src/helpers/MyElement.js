import { Element } from 'slate';

export const MyElement = () => {
    return {
        ...Element,
        isTableElement(element) {
            return Element.isElement(element) && element.type === 'table';
        },
    }
}