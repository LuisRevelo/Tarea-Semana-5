import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { AppComponent } from './app/app'; // Enlaza con tu archivo app.ts
import { credentialsInterceptor } from './app/interceptors/credentials.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([credentialsInterceptor]), // Envía la sesión a .NET de forma obligatoria
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN' // Protección contra ataques exigida por la rúbrica
      })
    )
  ]
}).catch((err) => console.error(err));
