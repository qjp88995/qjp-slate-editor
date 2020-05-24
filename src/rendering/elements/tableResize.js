const tableResizeChange = new Event('tableResizeChange');

class TableResize {
    constructor() {
        this._table = null;
        this._grid = null;
        this._type = null; // width | height | both
        this._flag = false;
        this._startXy = null;
        this._endXy = null;
    }

    get table() {
        return this._table;
    }

    set table(table) {
        this._table = table;
    }

    get grid() {
        return this._grid;
    }

    set grid(grid) {
        this._grid = grid;
    }

    get type() {
        return this._type;
    }

    set type(type) {
        this._type = type;
    }
    
    get flag() {
        return this._flag;
    }

    set flag(flag) {
        this._flag = flag;
    }

    get startXy() {
        return this._startXy;
    }

    set startXy(startXy) {
        this._startXy = startXy;
    }

    get endXy() {
        return this._endXy;
    }

    set endXy(endXy) {
        this._endXy = endXy;
        document.dispatchEvent(tableResizeChange);
    }

    clear = () => {
        this._table = null;
        this._grid = null;
        this._type = null;
        this._flag = false;
        this._startXy = null;
        this._endXy = null;
        document.dispatchEvent(tableResizeChange);
    }
}

export const tableResize = new TableResize();