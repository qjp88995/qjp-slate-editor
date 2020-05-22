import { Transforms } from "slate";

const tableSelectionChange = new Event('tableSelectionChange');

class TableSelection {
    constructor() {
        this._editor = null;
        this._table = null;
        this._selection = null;
        this._flag = false;
    }

    set editor(editor) {
        this._editor = editor;
        document.dispatchEvent(tableSelectionChange);
    }

    get editor() {
        return this._editor;
    }

    set table(table) {
        this._table = table;
        document.dispatchEvent(tableSelectionChange);
    }

    get table() {
        return this._table;
    }

    set selection(selection) {
        this._selection = selection;
        document.dispatchEvent(tableSelectionChange);
    }

    get selection() {
        return this._selection;
    }

    set flag(flag) {
        this._flag = flag;
        document.dispatchEvent(tableSelectionChange);
    }

    get flag() {
        return this._flag;
    }

    clear = () => {
        if (this._editor && this._table) {
            Transforms.setNodes(this._editor, {
                mergeCells: false,
            }, {
                at: this._table[1],
            });
        }
        this._editor = null;
        this._table = null;
        this._selection = null;
        this._flag = false;
        document.dispatchEvent(tableSelectionChange);
    }
}

export const tableSelection = new TableSelection();