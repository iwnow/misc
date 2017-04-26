import {check} from '../utils/typer';
import {Logger, ErrorReport} from './logger';

class EventEmitter {
    private eventHandlers: Map<string,((data?:any)=>void)[]>;

    constructor() {
        this.eventHandlers = new Map();
    }

    emit(eventData: IEventData) {
        if (!eventData || !eventData.name)
            return;
        const handlers = this.eventHandlers.get(eventData.name);
        if (!handlers || handlers.length == 0)
            return;
        handlers.forEach(i => {
            try {
                i(eventData.data);
            } catch (e) {
                Logger.reportServer(
                    new ErrorReport(`[EventEmitter] fail callback [${eventData.name}] 
                        with data [${JSON.stringify(eventData.data, null, 4)}] ${e.message}`, e.stack));
            }
        });
    }

    subscribe(sb:IEventSubscribe) {
        if (!sb || !sb.name || !check.isFunc(sb.cb))
            return null;
        if (!this.eventHandlers.has(sb.name))
            this.eventHandlers.set(sb.name, []);
        const hs = this.eventHandlers.get(sb.name);
        hs.push(sb.cb);
        return () => {
            const ind = hs.indexOf(sb.cb);
            if (ind == -1)
                return;
            hs.splice(ind, 1);
        }
    }
}

class EventService {
    private static _instance:EventEmitter;
    static get Instance() {
        if (!EventService._instance)
            EventService._instance = new EventEmitter();
        return EventService._instance;
    }
}

interface IEventData {
    name: string;
    data?: any;
}

interface IEventSubscribe {
    name: string;
    cb: (data?:any)=>void;
}

export {
    IEventData,
    IEventSubscribe,
    EventEmitter,
    EventService
}