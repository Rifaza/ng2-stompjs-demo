import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {RawDataComponent} from './components/rawdata/rawdata.component';
import {StatusComponent} from './components/status/status.component';
import {StompService, StompConfig} from '@stomp/ng2-stompjs';
import {stompConfigFactory} from './factories/stomp-config.factory';
import {ConfigLoader, ConfigModule, ConfigService} from '@ngx-config/core';
import {configLoaderFactory} from './factories/config-loader.factory';

@NgModule({
  declarations: [
    AppComponent,
    RawDataComponent,
    StatusComponent,
  ],
  imports: [
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: configLoaderFactory,
      deps: [Http]
    }),
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    StompService,
    {
      provide: StompConfig,
      useFactory: stompConfigFactory,
      deps: [ConfigService]
    }

  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
