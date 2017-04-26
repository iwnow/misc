import {alertServiceInsance, AlertType} from './alerts';

alertServiceInsance.notify({
  type: AlertType.info,
  message: 'hello mars :)'
});