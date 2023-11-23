import { Route } from '@angular/router';
import { BattlegroundComponent } from '@sw-battle/battle';

export const appRoutes: Route[] = [
  { path: '', component: BattlegroundComponent },
  { path: '**', redirectTo: '' },
];
