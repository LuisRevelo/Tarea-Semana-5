import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="container" style="max-width: 700px; margin: 40px auto; font-family: Arial, sans-serif; padding: 25px; border: 1px solid #dee2e6; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="color: #212529; text-align: center; margin-bottom: 20px;">Gestión de Productos - Universidad</h2>
      
      <!-- Formulario Amigable con Validaciones (Criterio 4 de la Rúbrica) -->
      <form [formGroup]="miFormulario" (ngSubmit)="guardarRegistro()" style="display: flex; flex-direction: column; gap: 15px;">
        
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label for="nombre" style="font-weight: bold; color: #495057;">Nombre del Producto:</label>
          <input id="nombre" formControlName="nombre" placeholder="Ej. Cuaderno Universitario" style="padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
          <span *ngIf="miFormulario.get('nombre')?.touched && miFormulario.get('nombre')?.invalid" style="color: #dc3545; font-size: 12px; font-weight: bold;">
            ⚠️ El nombre es obligatorio (mínimo 2 caracteres).
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label for="precio" style="font-weight: bold; color: #495057;">Precio de Venta ($):</label>
          <input id="precio" type="number" step="0.01" formControlName="precio" placeholder="0.00" style="padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 14px;">
          <span *ngIf="miFormulario.get('precio')?.touched && miFormulario.get('precio')?.invalid" style="color: #dc3545; font-size: 12px; font-weight: bold;">
            ⚠️ El precio debe ser un número positivo mayor a 0.
          </span>
        </div>

        <!-- El botón se bloquea de forma reactiva si el formulario no es válido (Rúbrica 4) -->
        <button type="submit" [disabled]="miFormulario.invalid" style="padding: 12px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.2s;">
          Insertar Registro en MySQL
        </button>
      </form>

      <hr style="margin: 30px 0; border: 0; border-top: 1px solid #dee2e6;">

      <!-- Tabla Dinámica (Criterio 1: Listado de datos) -->
      <h3 style="color: #343a40; margin-bottom: 15px;">Registros Almacenados en la Base de Datos</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;">
        <thead>
          <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6; color: #495057;">
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">ID</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Nombre del Artículo</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Precio Unitario</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of listaRegistros" style="border-bottom: 1px solid #dee2e6; color: #212529;">
            <td style="padding: 12px; border: 1px solid #dee2e6;">{{ item.id }}</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">{{ item.nombre }}</td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">$ {{ item.precio | number:'1.2-2' }}</td>
          </tr>
          <tr *ngIf="listaRegistros.length === 0">
            <td colspan="3" style="padding: 20px; text-align: center; color: #6c757d; border: 1px solid #dee2e6;">No hay registros cargados aún. ¡Usa el formulario de arriba!</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AppComponent implements OnInit {
  miFormulario: FormGroup;
  listaRegistros: any[] = [];
  private apiBaseUrl = 'http://localhost:5000/api/products';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.miFormulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit() {
    this.cargarTabla();
  }

  cargarTabla() {
    this.http.get<any[]>(this.apiBaseUrl).subscribe({
      next: (datos) => this.listaRegistros = datos,
      error: (err) => console.log('Esperando respuesta del servidor MySQL...')
    });
  }

  guardarRegistro() {
    if (this.miFormulario.invalid) return;

    this.http.post(this.apiBaseUrl, this.miFormulario.value).subscribe({
      next: () => {
        this.miFormulario.reset({ nombre: '', precio: 0 });
        this.cargarTabla();
      },
      error: (err) => alert('Error: No se pudo guardar. Verifica que el Backend de .NET esté encendido.')
    });
  }
}
