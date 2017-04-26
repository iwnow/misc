import {alertServiceInsance, AlertType, INotifyData} from '../services';

export interface IAlertComponentState {
    notices: {
        id: number;
        data: INotifyData;
    }[];
}

export class AlertComponent extends React.Component <any,IAlertComponentState> {
    constructor(props){
        super(props);
        this.state = {
            notices: []
        }
    }
    
    private static counter = 0;
    get newId() {return ++AlertComponent.counter;}

    private unsubscribe;
    private showSec = 7;

    componentDidMount() {
        this.unsubscribe = alertServiceInsance.subscribe(_data => {
            const toAdd = {
                id: this.newId,
                data: _data
            };
            const notices = this.state.notices.concat([toAdd]);
            this.setState({notices});
            setTimeout(() => {
                const ind = this.state.notices.indexOf(toAdd);
                if (ind == -1)
                    return;
                const nn = this.state.notices.slice(0, ind).concat(this.state.notices.slice(ind+1));
                this.setState({notices:nn});
            }, this.showSec*1000);
        });
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }

    maxCountSymbolsMsg = 1000;

    render() {
        const notices = this.state.notices.map(i => {
            const msg = i.data.message && i.data.message.length > this.maxCountSymbolsMsg ? 
            i.data.message.substr(0, this.maxCountSymbolsMsg) : i.data.message;
            switch (i.data.type) {
                case AlertType.error:
                case AlertType.warning:
                    return (
                        <div key={i.id} className="b-page__alert b-alert pointer">
                            <i className="b-alert__icon fa fa-warning"></i>
                            <span className="b-alert__txt">
                                {msg}                      
                            </span>                    
                        </div>
                    );
                case AlertType.info:
                    return (
                        <div key={i.id} className="b-page__alert b-alert pointer">
                            <i className="b-alert__icon fa fa-comment"></i>
                            <span className="b-alert__txt">
                                {msg}                      
                            </span>                    
                        </div>
                    );
                default:
                    return null;
            }
            
        });
        return (
            <div className="b-page__alerts" style={{position: 'fixed', zIndex: 99999}}>
                {notices}
            </div>
        );
    }
}

