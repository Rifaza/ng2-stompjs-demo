import {Http} from '@angular/http';
import {ConfigLoader} from '@ngx-config/core';
import {ConfigHttpLoader} from '@ngx-config/http-loader';

export function configLoaderFactory(http: Http): ConfigLoader {
  return new ConfigHttpLoader(http, '/src/api/config.json'); // API ENDPOINT
}
