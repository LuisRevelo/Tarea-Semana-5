using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using System;

namespace ServidorNet;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();

        // 1. Activar el almacén de memoria para la sesión
        builder.Services.AddDistributedMemoryCache();
        builder.Services.AddSession(options =>
        {
            options.IdleTimeout = TimeSpan.FromMinutes(20);
            options.Cookie.HttpOnly = true;   
            options.Cookie.IsEssential = true; 
            options.Cookie.SameSite = SameSiteMode.None; // Permite el intercambio entre puertos diferentes
            options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Seguridad exigida
        });

        // 2. CONFIGURACIÓN CORRECTA DE CORS: Enlaza directamente con las credenciales de Angular
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins("http://localhost:4200") // URL nativa de tu Angular
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials(); // OBLIGATORIO: Permite el paso de sesiones/cookies sin bloqueos
            });
        });

        var app = builder.Build();

        // IMPORTANTE: El orden de estas tres líneas es lo que evita el error de conexión
        app.UseCors();
        app.UseRouting();
        app.UseSession();

        app.MapControllers();
        app.Run();
    }
}
