import { ComponentRef, Directive, inject, ViewContainerRef } from '@angular/core';
import { ErrorMessage } from './error-message';

@Directive({
  selector: '[dfFieldErrorTracker]',
})
export class FieldErrorTracker {

  #vcr = inject(ViewContainerRef);
  #errorsComponent?: ComponentRef<ErrorMessage>;

  constructor() {
    /*
      TODO Task 1: Show errors from a directive (~7 min)

      Problem: the same error markup is copied 7 times across the form
      components.

      Goal: when the host field is invalid, render the ErrorMessage component
      dynamically after the host element. 

      NOTE: this directive is already attached to the first name input in customer-form.ts.
            and the @if/@for blocks that render the error messages have been removed.

      Steps:
        1. Find a way to reference the [formField] instance from this directive.
        2. Render form field errors using the ErrorMessage component + ComponentRef.createComponent() API once the field gets invalid.
        3. Prevent creating multiple instances of the component.

      TIP: the tracking of valid/invalid state of the field and error rendering can happen inside an effect.

      Check: reload the page. First Name shows "This field is required" at
      once, without a touch.

      References:
        - https://angular.dev/api/forms/signals/FORM_FIELD
        - https://angular.dev/guide/forms/signals/field-state-management#reading-validation-errors
        - https://angular.dev/api/core/ViewContainerRef
        - https://angular.dev/api/core/inputBinding
    */

    /*
      TODO Task 2: Remove errors when the field becomes valid (~5 min)

      Problem: the error message from Task 1 stays on screen even when the error is gone.

      Goal: destroy the created component when the field becomes valid.

      Steps:
        1. Create another effect that watches the field's valid state.
        2. Destroy the component when the field becomes valid.

      Check: type a first name. The directive's message disappears.

      References:
        - https://angular.dev/guide/forms/signals/field-state-management#checking-validity
        - https://angular.dev/api/core/effect
    */

    /*
      TODO: Task 4: Make the display strategy configurable (~8 min)

      Problem: errors appear on page load, before the user touches anything.
      When to show errors is a UX decision of the app, not of the directive.

      Goal: Design a scalable and configurable architecture that allows to configure
      at which point errors should be displayed e.g when field is touched()/dirty()/etc.

      Ideally, the solution should have API similar to how the current provideSignalFormsConfig() works.

      TIP: The building blocks for this solution you can find in error-display-config.ts.

      Check: Configure the errors to be displayed only for touched fields. 
      Refresh the page and see no errors shown. Focus on First Name and leave it:
      "This field is required" appears. Same UX as before the lab — now from
      one directive instead of 7 template copies. 
      
      The lab is done. 🎉

      References:
        - https://angular.dev/guide/forms/signals/field-state-management#conditional-error-display
        - https://angular.dev/api/core/InjectionToken
        - https://angular.dev/guide/forms/signals/field-state-management#touched-state
    */
  }

}
