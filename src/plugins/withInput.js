import { Editor } from 'slate';

export const withInput = editor => {
    const { isInline } = editor;

    editor.isInline = element => {
        if (element.type === 'checkbox') return true;
        if (element.type === 'radio') return true;
        if (element.type === 'input') return true;
        if (element.type === 'textarea') return true;
        return isInline(element);
    }
    
    return editor;
}