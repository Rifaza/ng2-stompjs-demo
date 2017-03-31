import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { StompConfig } from './';

import * as Stomp from '@stomp/stompjs';
import { ConfigService } from "../config/config.service";

/** possible states for the STOMP service */
export enum STOMPState {
  CLOSED,
  TRYING,
  CONNECTED,
  DISCONNECTING
}

/**
 * Angular2 STOMP Service using stomp.js
 *
 * @description This service handles subscribing to a
 * message queue using the stomp.js library, and returns
 * values via the ES6 Observable specification for
 * asynchronous value streaming by wiring the STOMP
 * messages into a observable.
 */
@Injectable()
export class STOMPService {

  // State of the STOMPService
  public state: BehaviorSubject<STOMPState>;

  // Configuration structure with MQ creds
  private config: StompConfig;

  // STOMP Client from stomp.js
  private client: Stomp.Client;

  /** Constructor */
  public constructor(private _configService: ConfigService) {
    this.state = new BehaviorSubject<STOMPState>(STOMPState.CLOSED);

    // Get configuration from config service...
    this._configService.getConfig('api/config.json').then(
      config => {
        // ... then pass it to (and connect) STOMP:
        this.configure(config);
        this.try_connect();
      }
    );
  }

  /** Set up configuration */
  private configure(config?: StompConfig): void {

    this.config = config;

    // Connecting via SSL Websocket?
    let scheme = 'ws';
    if (this.config.ssl) {
      scheme = 'wss';
    }

    // Attempt connection, passing in a callback
    this.client = Stomp.client(`${scheme}://${this.config.host}:${this.config.port}/${this.config.path}`);

    // Configure client heartbeating
    this.client.heartbeat.incoming = this.config.heartbeat_in;
    this.client.heartbeat.outgoing = this.config.heartbeat_out;

    // Auto reconnect
    this.client.reconnect_delay = this.config.reconnect_delay;

    // Set function to debug print messages
    this.client.debug = this.config.debug || this.config.debug == null ? this.debug : null;
  }


  /**
   * Perform connection to STOMP broker
   */
  private try_connect(): void {

    // Attempt connection, passing in a callback
    this.client.connect(
      this.config.user,
      this.config.pass,
      this.on_connect,
      this.on_error
    );

    console.log('Connecting...');
    this.state.next(STOMPState.TRYING);
  }


  /** Disconnect the STOMP client and clean up,
   * not sure how this method will get called, if ever */
  public disconnect(): void {

    // Notify observers that we are disconnecting!
    this.state.next(STOMPState.DISCONNECTING);

    // Disconnect if connected. Callback will set CLOSED state
    if (this.client && this.client.connected) {
      this.client.disconnect(
        () => this.state.next(STOMPState.CLOSED)
      );
    }
  }

  /** Send a message to all topics */
  public publish(queueName: string, message?: string): void {
    this.client.send(queueName, {}, message);
  }

  /** Subscribe to server message queues */
  public subscribe(queueName: string): Observable<Stomp.Message> {

    /** Well the logic is complicated but works beautifully. RxJS is indeed wonderful.
     *
     * We need to activate the underlying subscription immediately if Stomp is connected. If not it should
     * subscribe when it gets next connected. Further it should re establish the subscription whenever Stomp
     * successfully reconnects.
     *
     * Actual implementation is simple, we filter the BehaviourSubject 'state' so that we can trigger whenever Stomp is
     * connected. Since 'state' is a BehaviourSubject, if Stomp is already connected, it will immediately trigger.
     *
     * The observable that we return to caller remains same across all reconnects, so no special handling needed at
     * the message subscriber.
     */
    console.log(`Request to subscribe ${queueName}`);

    return Observable.create((messages) => {
      this.state
        .filter((currentState: number) => {return currentState === STOMPState.CONNECTED})
        .subscribe(() => {
          this.client.subscribe(queueName, (message: Stomp.Message) => {
              messages.next(message);
            },
            {ack: 'auto'});
        });
    });
  }


  /**
   * Callback Functions
   *
   * Note the method signature: () => preserves lexical scope
   * if we need to use this.x inside the function
   */
  private debug = (args): void => {
      console.log(args);
  };

  // Callback run on successfully connecting to server
  private on_connect = () => {

    console.log('Connected');

    // Indicate our connected state to observers
    this.state.next(STOMPState.CONNECTED);
  };

  // Handle errors from stomp.js
  private on_error = (error: string | Stomp.Message) => {

    if (typeof error === 'object') {
      error = (<Stomp.Message>error).body;
    }

    console.error(`Error: ${error}`);

    // Check for dropped connection and try reconnecting
    if (!this.client.connected) {
      // Reset state indicator
      this.state.next(STOMPState.CLOSED);
    }
  };
}
