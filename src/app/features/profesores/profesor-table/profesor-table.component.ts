import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Profesor } from 'src/app/core/models/profesor';
import { ProfesorService } from 'src/app/core/services/profesor.service';
import { ProfesorDialogComponent } from '../profesor-dialog/profesor-dialog.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-profesor-table',
  templateUrl: './profesor-table.component.html',
  styleUrls: ['./profesor-table.component.scss']
})
export class ProfesorTableComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MatSort)
  private sort!: MatSort;
  @ViewChild(MatPaginator)
  private paginator!: MatPaginator;

  public dataSource: MatTableDataSource<Profesor>;
  public loading: boolean;
  public displayedColumns: string[] = ['id', 'apellidoNombre', 'fechaNacimiento', 'dni', 'email', 'password', 'cursos', 'modificar', 'eliminar'];
  private subscriptions!: Subscription[];

  constructor(private profesorService: ProfesorService, private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.subscriptions = [];
    this.dataSource = new MatTableDataSource<Profesor>();
    this.dataSource.filterPredicate = (data: Profesor, filter: string) => data.apellido?.trim().toLowerCase().startsWith(filter?.trim().toLowerCase());
    this.obtenerProfesores();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filtrar(event: Event) {
    const filteredValue: string = (event.target as HTMLInputElement)?.value;
    this.dataSource.filter = filteredValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerProfesores(): void {
    this.loading = true;
    this.subscriptions.push(this.profesorService.obtenerProfesores().subscribe({
      next: (profesores) => {
        this.dataSource.data = profesores;
        console.log("next");
        // this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showSnackBar("Se ha producido un error al obtener los datos.");
        console.log("error");
      },
      complete: () => {
        this.loading = false;
        console.log("complete");
      }
    }));
  }

  altaProfesor(): void {
    const dialog = this.dialogService.open(ProfesorDialogComponent);
    this.subscriptions.push(dialog.afterClosed().subscribe((value) => {
      if (value?.nombre && value?.apellido && value?.fechaNacimiento && value?.dni) {
        this.showSnackBar("Profesor ID: " + value.id + " creado.");
      }
    }));
  }

  eliminarProfesor(profesor: Profesor): void {
    this.subscriptions.push(this.profesorService.eliminarProfesor(profesor).subscribe((p) => {
      this.showSnackBar("Profesor ID: " + p.id + " eliminado.");
    }));
  }

  modificarProfesor(profesor: Profesor): void {
    const dialog = this.dialogService.open(ProfesorDialogComponent, { data: profesor });
    this.subscriptions.push(dialog.afterClosed().subscribe((value) => {
      if (value?.nombre && value?.apellido && value?.fechaNacimiento && value?.dni) {
        this.showSnackBar("Profesor ID: " + value.id + " modificado.");
      }
    }));
  }

  verCursos(profesorId: number): void {

  }

  showSnackBar(message: string) {
    this._snackBar.open(message, "cerrar", {
      duration: 3000,
    });
  }

}
