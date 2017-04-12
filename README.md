# @stomp/ng2-stompjs Angular 2 Demo App

> A demo application using [Angular 2](https://github.com/angular/angular) in
[Typescript](https://github.com/Microsoft/TypeScript) and [@stomp/ng2-stompjs](https://github.com/stomp-js/ng2-stompjs),
> generated with [angular-cli](https://github.com/angular/angular-cli).

This is a forked version of https://github.com/sjmf/ng2-stompjs-demo

## Setup

Install dependencies:

```bash
$ npm install
```
or, if using yarn

```bash
$ yarn
```

Configure details for your Stomp Broker by editing
 `src/api/config.json`

The configuration should work as is for a RabbitMQ instance
 running on localhost with default settings and Web STOMP 
 plugin activated.
 (see: https://www.rabbitmq.com/web-stomp.html).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 
The app will automatically reload if you change any of the source files.

## Where Next

Check the following files:

- src/app/services/config/config.service.ts -
  The configuration service. This service fetches a json file (stored in src/api/config.json).
- src/app/app.module.ts - Service provisions for
  [Dependency Injection](https://angular.io/docs/ts/latest/guide/dependency-injection.html).
- src/app/components/rawdata/rawdata.component.ts - subscribing / unsubscribing a queue and
  publishing messages.
- src/app/components/status/status.component.ts - monitoring status of Stomp connection.

## Contributors

- [Sam Finnigan](https://github.com/sjmf)
- [Jimi (Dimitris) Charalampidis](https://github.com/JimiC)
- [Deepak Kumar](https://github.com/kum-deepak)

## License

MIT

