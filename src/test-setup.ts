import { ApplicationRef } from '@angular/core';

// A small safety patch for the test environment: ensure ApplicationRef has an isStable observable
// so internal schedulers that expect it don't blow up in tests.
try {
  (ApplicationRef.prototype as any).isStable = (ApplicationRef.prototype as any).isStable || {
    subscribe: (fn: any) => {
      fn(true);
      return { unsubscribe() {} };
    },
  };
} catch (e) {
  // ignore if not possible in some environments
}
