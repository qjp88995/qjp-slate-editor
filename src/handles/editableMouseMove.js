import { tableResize } from "../rendering/elements/tableResize"

export const editableMouseMove = (event, editor) => {
    if (tableResize.table && tableResize.flag) {
        tableResize.endXy = [event.pageX, event.pageY];
    }
}