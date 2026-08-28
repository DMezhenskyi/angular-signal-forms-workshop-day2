import { Routes } from '@angular/router';
import { FormInspector } from '@features/form-inspector/form-inspector';
import { DynamicFormsPlayground } from '@features/dynamic-forms-playground/dynamic-forms-playground';

export const routes: Routes = [
  {
    path: '',
    component: DynamicFormsPlayground,
  },
  {
    path: '',
    outlet: 'sidebar',
    component: FormInspector,
  },
];
