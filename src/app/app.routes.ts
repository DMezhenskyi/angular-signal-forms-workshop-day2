import { Routes } from '@angular/router';
import { Playground } from '@features/playground/playground';
import { FormInspector } from '@features/form-inspector/form-inspector';

export const routes: Routes = [
  {
    path: '',
    component: Playground,
  },
  {
    path: '',
    outlet: 'sidebar',
    component: FormInspector,
  },
];
