import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Inscripcion } from 'src/app/core/models/inscripcion';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { CursoService } from 'src/app/core/services/curso.service';
import { InscripcionService } from 'src/app/core/services/inscripcion.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-inscripcion-table',
  templateUrl: './inscripcion-table.component.html',
  styleUrls: ['./inscripcion-table.component.scss']
})
export class InscripcionTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort)
  private sort!: MatSort;
  @ViewChild(MatPaginator)
  private paginator!: MatPaginator;

  public dataSource: MatTableDataSource<Inscripcion>;
  public readonly displayedColumns: string[] = ['id', 'curso', 'alumno', 'eliminar'];
  public loading: boolean;
  private subscriptions!: Subscription[];

  constructor(private inscripcionService: InscripcionService, private alumnoService: AlumnoService, private cursoService: CursoService, private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.subscriptions = [];
    this.dataSource = new MatTableDataSource<Inscripcion>();
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Inscripcion, filter: string) => data.curso?.id === Number(filter?.trim()) || (data.curso ? data.curso.materia.toLowerCase().startsWith(filter.trim().toLowerCase()) : false);
    this.obtenerInscripciones();
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

  obtenerInscripciones(): void {
    this.loading = true;
    this.subscriptions.push(this.inscripcionService.obtenerInscripciones().subscribe({
      next: (inscripciones) => {
        this.dataSource.data = inscripciones;
        console.log("next");
      },
      error: () => {
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

  altaInscripcion(): void {
  }

  eliminarInscripcion(inscripcion: Inscripcion): void {
    this.subscriptions.push(this.inscripcionService.eliminarInscripcion(inscripcion).subscribe((i) => {
      this.obtenerInscripciones();
      this.showSnackBar("Inscripción ID: " + i.id + " eliminada.");
    }));
  }

  openDialog(inscripcion: Inscripcion): void {
    const dialog = this.dialogService.open(DialogComponent, {
      data: {
        inscripcion: inscripcion
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarInscripcion(inscripcion);
      }
    });
  }

  private showSnackBar(message: string) {
    this._snackBar.open(message, "cerrar", {
      duration: 3000,
    });
  }

}
