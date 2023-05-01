import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Alumno } from 'src/app/core/models/alumno';
import { AlumnoDialogComponent } from '../alumno-dialog/alumno-dialog.component';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-alumno-table',
  templateUrl: './alumno-table.component.html',
  styleUrls: ['./alumno-table.component.scss']
})
export class AlumnosTableComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MatSort)
  private sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource: MatTableDataSource<Alumno>;
  public displayedColumns: string[] = ['id', 'nombre', 'apellido', 'fechaNacimiento', 'dni', 'provincia', 'localidad', 'calle', 'email', 'password', 'modificar', 'eliminar'];
  public loading: boolean;
  private subscriptions!: Subscription[];

  constructor(private alumnoService: AlumnoService, private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.subscriptions = [];
    this.dataSource = new MatTableDataSource<Alumno>();
    this.obtenerAlumnos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement)?.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerAlumnos(): void {
    this.loading = true;
    this.subscriptions.push(this.alumnoService.obtenerAlumnos().subscribe({
      next: (alumnos) => {
        console.log(alumnos);
        this.dataSource.data = alumnos;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar("Se ha producido un error al obtener los datos.");
        this.loading = false;
      },
      complete: () => {
        console.log("complete");
        this.loading = false;
      }
    }));
  }

  altaAlumno(): void {
    const dialog = this.dialogService.open(AlumnoDialogComponent);
    this.subscriptions.push(dialog.afterClosed().subscribe((alumno) => {
      if (alumno?.nombre && alumno?.apellido && alumno?.fechaNacimiento) {
        this.showSnackBar("Alumno ID: " + alumno.id + " creado.");
      }
    }));
  }

  eliminarAlumno(alumno: Alumno): void {
    this.subscriptions.push(this.alumnoService.eliminarAlumno(alumno).subscribe((al) => {
      this.showSnackBar("Alumno ID: " + al.id + " eliminado.");
    }));
  }

  modificarAlumno(alumno: Alumno): void {
    const dialog = this.dialogService.open(AlumnoDialogComponent, { data: alumno });
    this.subscriptions.push(dialog.afterClosed().subscribe((al) => {
      if (al?.nombre && al?.apellido && al?.fechaNacimiento) {
        this.showSnackBar("Alumno ID: " + al.id + " modificado.");
      }
    }));
  }

  private showSnackBar(message: string) {
    this._snackBar.open(message, "cerrar", {
      duration: 3000,
    });
  }

}
