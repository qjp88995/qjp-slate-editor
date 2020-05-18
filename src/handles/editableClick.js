import { selectTableCell } from './tableEvent';

export const editableClick = (event, editor) => {
    selectTableCell(event, editor);
}