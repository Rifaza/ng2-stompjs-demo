import 'rxjs/add/operator/toPromise';
import {ConfigService} from '@ngx-config/core';
import {StompConfig} from '@stomp/ng2-stompjs';

export function stompConfigFactory(_configService: ConfigService): StompConfig {
  return <StompConfig>_configService.getSettings();
}
