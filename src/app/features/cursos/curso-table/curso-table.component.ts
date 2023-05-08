import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription, catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { Curso } from 'src/app/core/models/curso';
import { CursoService } from 'src/app/core/services/curso.service';
import { CursoDialogComponent } from '../curso-dialog/curso-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { Inscripcion } from 'src/app/core/models/inscripcion';
import { InscripcionService } from 'src/app/core/services/inscripcion.service';

@Component({
  selector: 'app-curso-table',
  templateUrl: './curso-table.component.html',
  styleUrls: ['./curso-table.component.scss']
})
export class CursoTableComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MatSort)
  private sort!: MatSort;
  @ViewChild(MatPaginator)
  private paginator!: MatPaginator;

  public dataSource: MatTableDataSource<Curso>;
  public displayedColumns: string[] = ['id', 'materia', 'profesor', 'alumnos', 'modificar', 'eliminar'];
  public loading: boolean;
  private subscriptions!: Subscription[];

  constructor(private cursoService: CursoService, private inscripcionService: InscripcionService, private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.subscriptions = [];
    this.dataSource = new MatTableDataSource<Curso>();
    this.dataSource.filterPredicate = (data: Curso, filter: string) => data.materia.trim().toLowerCase().startsWith(filter?.trim().toLowerCase());
    this.obtenerCursos();
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

  obtenerCursos(): void {
    this.subscriptions.push(this.cursoService.obtenerCursos().subscribe({
      next: (cursos) => {
        console.log(cursos);
        this.dataSource.data = cursos;
        console.log("next");
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

  altaCurso(): void {
    const dialog = this.dialogService.open(CursoDialogComponent);
    this.subscriptions.push(dialog.afterClosed().subscribe((curso: Curso) => {
      if (curso) {
        this.cursoService.altaCurso(curso).subscribe((cursoCreado) => {
          const altaInscripcionesObservables: Observable<any>[] = curso.alumnos?.map(alumno => {
            return this.inscripcionService.altaInscripcion(new Inscripcion(0, cursoCreado, alumno));
          }) || [];
          forkJoin(altaInscripcionesObservables).subscribe(() => {
            this.obtenerCursos();
            this.showSnackBar("Curso ID: " + cursoCreado.id + " creado.");
          });
        });
      }
    }));
  }

  eliminarCurso(curso: Curso): void {
    this.subscriptions.push(this.cursoService.eliminarCurso(curso).subscribe((c) => {
      this.obtenerCursos();
      this.showSnackBar("Curso ID: " + c.id + " eliminado.");
    }));
  }

  modificarCurso(curso: Curso): void {
    const dialog = this.dialogService.open(CursoDialogComponent, { data: curso });
    this.subscriptions.push(dialog.afterClosed().subscribe((cursoModificado) => {
      if (cursoModificado) {
        // this.obtenerCursos();
        this.showSnackBar("Curso ID: " + cursoModificado.id + " modificado.");
      }
    }));
  }

  private showSnackBar(message: string) {
    this._snackBar.open(message, "cerrar", {
      duration: 3000,
    });
  }

}
