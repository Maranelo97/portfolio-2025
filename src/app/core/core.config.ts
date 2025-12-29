import { Provider, EnvironmentProviders } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const CORE_PROVIDERS: (Provider | EnvironmentProviders)[] = [provideHttpClient(withFetch())];
