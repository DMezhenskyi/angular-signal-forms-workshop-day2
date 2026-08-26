import { email, required, schema, validateHttp } from "@angular/forms/signals";
import { Customer, EmailCheckResult } from "./customer";
import { HttpContext } from "@angular/common/http";
import { EMAIL_SIMULATION_MODE } from "@core/http/simulation-mode";

export const customerFormSchema = schema<Customer>((p) => {
      required(p.firstName, { message: `This field is required`});
      required(p.lastName, { message: `This field is required`});
      required(p.email, { message: `This field is required`});
      email(p.email, { message: `Please enter a valid email address` });
      validateHttp<string, EmailCheckResult>(p.email, {
        request: (ctx) => ({
          url: `/user/email/check?email=${ctx.value()}`,
          context: new HttpContext().set(EMAIL_SIMULATION_MODE, 'allowed')
        }),
        onSuccess: (result, ctx) => {
          if (!result.allowed) {
            return ({
              kind: 'email-taken',
              message: result.reason ?? `This email is already taken`,
            });
          }
          return;
        },
        onError: () => {
          return ({
            kind: 'email-taken-network-error',
            message: `Network error while checking email availability`,
          })
          
        }
      })
})