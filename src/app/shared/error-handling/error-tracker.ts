import { ComponentRef, Directive, inject, ViewContainerRef } from '@angular/core';
import { ErrorMessage } from './error-message';

@Directive({
  selector: '[dfFieldErrorTracker]',
})
export class FieldErrorTracker {

  #vcr = inject(ViewContainerRef);
  #errorsComponent?: ComponentRef<ErrorMessage>;

  constructor() { }

}
