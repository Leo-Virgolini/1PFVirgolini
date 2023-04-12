import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Alumno } from 'src/app/core/models/alumno';
import { AlumnoDialogComponent } from '../alumno-dialog/alumno-dialog.component';
import { alumnos } from '../alumnos';

@Component({
  selector: 'app-alumno-table',
  templateUrl: './alumno-table.component.html',
  styleUrls: ['./alumno-table.component.scss']
})
export class AlumnosTableComponent implements AfterViewInit, OnDestroy {

  // @ViewChild(MatTable)
  // table!: MatTable<Alumno>;

  @ViewChild(MatSort)
  private sort!: MatSort;

  // @ViewChild(MatSort)
  // public set sort(sort: MatSort) {
  //   this.dataSource.sort = sort;
  // }

  public dataSource: MatTableDataSource<Alumno>;
  public loading: boolean;
  displayedColumns: string[] = ['id', 'nombre', 'fechaNacimiento', 'promedio', 'modificar', 'eliminar'];

  constructor(private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.dataSource = new MatTableDataSource<Alumno>();
    this.obtenerAlumnos();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
  }

  obtenerAlumnos(): void {
    this.loading = true;
    this.dataSource.data = alumnos;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  altaAlumno(): void {
    const dialog = this.dialogService.open(AlumnoDialogComponent);

    dialog.afterClosed().subscribe((value) => {
      if (value?.nombre && value?.apellido && value?.fechaNacimiento) {
        this.obtenerAlumnos();
        this.showSnackBar("Alumno ID: " + value.id + " creado.");
      }
    })
  }

  eliminarAlumno(alumnoId: number): void {
    const index = alumnos.findIndex(alumno => alumno.id === alumnoId);
    if (index != -1) {
      alumnos.splice(index, 1);
      this.obtenerAlumnos();
      this.showSnackBar("Alumno ID: " + alumnoId + " eliminado.")
    }
  }

  modificarAlumno(alumno: Alumno): void {
    const dialog = this.dialogService.open(AlumnoDialogComponent, { data: alumno });

    dialog.afterClosed().subscribe((value) => {
      if (value?.nombre && value?.apellido && value?.fechaNacimiento) {
        this.obtenerAlumnos();
        this.showSnackBar("Alumno ID: " + value.id + " modificado.");
      }
    })
  }

  private showSnackBar(message: string) {
    this._snackBar.open(message, "cerrar", {
      duration: 3000,
    });
  }

}
