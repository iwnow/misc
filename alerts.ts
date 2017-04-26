import * as Events from './events';

export enum AlertType {
    info,
    warning,
    error
}

export interface INotifyData {
    type: AlertType;
    message: string;
}

export class AlertService {
    private eventName = 'crm-alert-service-event';

    notify(data:INotifyData) {
        Events.EventService.Instance.emit({
            data: data,
            name: this.eventName
        });
    }

    subscribe(_cb:(data:INotifyData)=>void) {
        return Events.EventService.Instance.subscribe({
            cb: _cb,
            name: this.eventName
        });
    }
}

export class AlertProvider {
    private static service: AlertService;
    static get Instance() {
        if (!AlertProvider.service)
            AlertProvider.service = new AlertService();
        return AlertProvider.service;
    }
}

export const alertServiceInsance = AlertProvider.Instance;
