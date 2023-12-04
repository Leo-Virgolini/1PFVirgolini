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
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-profesor-table',
  templateUrl: './profesor-table.component.html',
  styleUrls: ['./profesor-table.component.scss']
})
export class ProfesorTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort)
  private sort!: MatSort;
  @ViewChild(MatPaginator)
  private paginator!: MatPaginator;

  public dataSource: MatTableDataSource<Profesor>;
  public loading: boolean;
  public readonly displayedColumns: string[] = ['id', 'apellidoNombre', 'fechaNacimiento', 'dni', 'email', 'password', 'cursos', 'modificar', 'eliminar'];
  private subscriptions!: Subscription[];
  public show: boolean;

  constructor(private profesorService: ProfesorService, private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.subscriptions = [];
    this.dataSource = new MatTableDataSource<Profesor>();
    this.show = false;
  }

  ngOnInit(): void {
    if (this.dataSource) {
      this.dataSource.filterPredicate = (data: Profesor, filter: string) => data?.apellido.trim().toLowerCase().startsWith(filter?.trim().toLowerCase()) || data?.nombre.trim().toLowerCase().startsWith(filter?.trim().toLowerCase());
      this.obtenerProfesores();
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  filtrar(event: Event) {
    if (this.dataSource) {
      const filteredValue: string = (event.target as HTMLInputElement)?.value;
      this.dataSource.filter = filteredValue;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  obtenerProfesores(): void {
    this.loading = true;
    this.subscriptions.push(this.profesorService.obtenerProfesores().subscribe({
      next: (profesores) => {
        if (profesores)
          this.dataSource.data = profesores;
        console.log("next");
        // this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.loading = false;
        this.showSnackBar("Se ha producido un error al obtener los datos: '" + error.message + "'");
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
    this.subscriptions.push(dialog.afterClosed().subscribe((result) => {
      if (result?.error) {
        this.showSnackBar("Error: " + (result.message));
      } else if (result?.nombre && result?.apellido && result?.fechaNacimiento && result?.dni) {
        this.obtenerProfesores();
        this.showSnackBar("Profesor ID: " + result.id + " creado.");
      }
    }));
  }

  eliminarProfesor(profesor: Profesor): void {
    this.subscriptions.push(this.profesorService.eliminarProfesor(profesor).subscribe(
      {
        next: (p) => {
          this.obtenerProfesores();
          this.showSnackBar("Profesor ID: " + p.id + " eliminado.");
        },
        error: (err) => this.showSnackBar("Error: " + (err.message))
      }
    ));
  }

  modificarProfesor(profesor: Profesor): void {
    const dialog = this.dialogService.open(ProfesorDialogComponent, { data: profesor });
    this.subscriptions.push(dialog.afterClosed().subscribe((result) => {
      if (result?.error) {
        this.showSnackBar("Error: " + (result.message));
      } else if (result?.nombre && result?.apellido && result?.fechaNacimiento && result?.dni) {
        this.showSnackBar("Profesor ID: " + result.id + " modificado.");
      }
    }));
  }

  openDialog(profesor: Profesor): void {
    const dialog = this.dialogService.open(DialogComponent, {
      data: {
        profesor: profesor
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarProfesor(profesor);
      }
    });
  }

  showSnackBar(message: string) {
    this._snackBar.open(message, "Cerrar", {
      duration: 3000,
    });
  }

}
