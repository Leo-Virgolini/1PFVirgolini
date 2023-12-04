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
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-alumno-table',
  templateUrl: './alumno-table.component.html',
  styleUrls: ['./alumno-table.component.scss']
})
export class AlumnoTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort, { static: false })
  private sort!: MatSort;
  @ViewChild(MatPaginator)
  private paginator!: MatPaginator;

  public dataSource: MatTableDataSource<Alumno>;
  public readonly displayedColumns: string[] = ['id', 'nombre', 'apellido', 'fechaNacimiento', 'dni', 'provincia', 'localidad', 'calle', 'email', 'password', 'modificar', 'eliminar'];
  public loading: boolean;
  private subscriptions!: Subscription[];
  public show: boolean;

  constructor(private alumnoService: AlumnoService, private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.subscriptions = [];
    this.dataSource = new MatTableDataSource<Alumno>();
    this.show = false;
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Alumno, filter: string) => data.apellido.trim().toLowerCase().startsWith(filter?.trim().toLowerCase()) || data.nombre.trim().toLowerCase().startsWith(filter?.trim().toLowerCase());
    this.obtenerAlumnos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filtrar(event: Event): void {
    const filteredValue: string = (event.target as HTMLInputElement)?.value;
    this.dataSource.filter = filteredValue;

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
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar("Se ha producido un error al obtener los datos: '" + error.message + "'");
        this.loading = false;
      },
      complete: () => {
        console.log("complete");
        this.dataSource.sort = this.sort;
        this.loading = false;
      }
    }));
  }

  altaAlumno(): void {
    const dialog = this.dialogService.open(AlumnoDialogComponent);
    this.subscriptions.push(dialog.afterClosed().subscribe((result: any) => {
      if (result?.error) {
        this.showSnackBar("Error: " + (result.message));
      } else if (result?.nombre && result?.apellido && result?.fechaNacimiento && result?.dni && result?.provincia && result?.localidad && result?.calle && result?.email && result?.password) {
        this.obtenerAlumnos();
        this.showSnackBar("Alumno ID: " + result.id + " creado.");
      }
    }));
  }

  eliminarAlumno(alumno: Alumno): void {
    this.subscriptions.push(this.alumnoService.eliminarAlumno(alumno).subscribe(
      {
        next: (al) => {
          this.obtenerAlumnos();
          this.showSnackBar("Alumno ID: " + al.id + " eliminado.");
        },
        error: (err) => this.showSnackBar("Error: " + (err.message))
      }));
  }

  modificarAlumno(alumno: Alumno): void {
    const dialog = this.dialogService.open(AlumnoDialogComponent, { data: alumno });
    this.subscriptions.push(dialog.afterClosed().subscribe((result) => {
      if (result?.error) {
        this.showSnackBar("Error: " + (result.message));
      } else if (result?.nombre && result?.apellido && result?.fechaNacimiento && result?.dni && result?.provincia &&
        result?.localidad && result?.calle && result?.email && result?.password) {
        this.showSnackBar("Alumno ID: " + result.id + " modificado.");
      }
    }));
  }

  openDialog(alumno: Alumno): void {
    const dialog = this.dialogService.open(DialogComponent, {
      data: {
        alumno: alumno
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarAlumno(alumno);
      }
    });
  }

  private showSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 3000
    });
  }

}
