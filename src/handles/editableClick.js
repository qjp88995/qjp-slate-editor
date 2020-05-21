import { unSelectTableCell } from './tableEvent';

export const editableClick = (event, editor) => {
    unSelectTableCell(event, editor);
}