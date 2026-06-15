import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    withCredentials: true // Permite que las variables de sesión viajen a .NET
  });
  return next(clonedRequest);
};
