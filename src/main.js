import environment from './environment';
import * as LogManager from 'aurelia-logging';
import {ConsoleAppender} from 'aurelia-logging-console';


//Configure Bluebird Promises.
Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('validation')
    .feature('resources');

  LogManager.addAppender(new ConsoleAppender());
  LogManager.setLevel(LogManager.logLevel.info);

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
