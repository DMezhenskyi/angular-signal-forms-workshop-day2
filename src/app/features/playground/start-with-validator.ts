import { LogicFn, OneOrMany, SchemaPath, ValidationError, validate } from "@angular/forms/signals";

type ValueOrLogicFn<T> = T | LogicFn<string, T>;

type StartWithConfig = {
  when?: LogicFn<string, boolean>;
  message?: ValueOrLogicFn<string>;
  error?: ValueOrLogicFn<OneOrMany<ValidationError>>;
};

export function startWithValidator(
  path: SchemaPath<string>,
  startWith: ValueOrLogicFn<string>,
  config?: StartWithConfig
) {
  validate(path, (ctx) => {
    // Validation is switched off for the current field state
    if (config?.when && !config.when(ctx)) {
      return;
    }
    // Empty value is the job of required(), not of this validator
    if (!ctx.value()) {
      return;
    }

    const prefix = typeof startWith === 'function' ? startWith(ctx) : startWith;

    // Value starts with the expected prefix -> exit validation with success
    if (ctx.value().toUpperCase().startsWith(prefix.toUpperCase())) {
      return;
    }

    // A custom error wins over a message, exactly like in the built-in validators
    if (config?.error) {
      return typeof config.error === 'function' ? config.error(ctx) : config.error;
    }

    const message = typeof config?.message === 'function' ? config.message(ctx) : config?.message;

    return {
      kind: 'start-with',
      message: message ?? `Value should start with ${prefix}`,
    };
  });
}
