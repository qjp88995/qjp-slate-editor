class EventManager {
    constructor() {
        this._events = {};
        this._count = 0;
        this._nextKey = 0;
    }

    toArray = () => {
        const keys = Object.keys(this._events);
        return keys.map(key => ({
            key,
            ...this._events[key],
        }));
    }

    isExisted = ({ type, event }) => {
        return this.toArray().some(item => item && item.type === type && item.event === event);
    }

    register = ({ type, event }) => {
        if (this.isExisted({ type, event })) return;
        const key = this._nextKey;
        this._events[key] = { type, event };
        this._count++;
        this._nextKey++;
        return key;
    }

    remove = props => {
        let result = false;
        if (typeof props === 'number') {
            result = delete this._events[props];
        } else {
            const { type, event  } = props;
            const _event = this.toArray().find(item => item && item.type === type && item.type === event);
            console.log(_event);
            if (_event) result = delete this._events[_event.key];
        }
        if (result) this._count--;
    }

    filter = type => {
        return this.toArray().filter(item => item.type === type);
    }

    removeAll = () => {
        this._events = {};
        this._count = 0;
    }
}

export const eventManager = new EventManager();