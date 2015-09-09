## v2.0.0

- Performance optimizations;
- Emitter rewrite;
- Options to disable deferred execution.

## v1.2.0

- BC breaking change and minor version bump - renamed Emmit to Emit.

## v1.1.1

- In Firefox, execution of the event handler is delayed by 4ms. This is to compromise with Firefox's 4ms minimum timeout value. This should not be a show-stopper in most cases, however, I am now actively searching how to circumvent this limitation.