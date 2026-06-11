import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';

export const unwrapResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const body = event.body;
        const anyBody = body as any;
        if (anyBody && typeof anyBody === 'object') {
          // Centralized unwrapper
          if ('data' in anyBody || 'Data' in anyBody || 'value' in anyBody || 'Value' in anyBody) {
            const unwrapped = anyBody.data ?? anyBody.Data ?? anyBody.value ?? anyBody.Value ?? body;
            return event.clone({ body: unwrapped });
          }
        }
      }
      return event;
    })
  );
};
