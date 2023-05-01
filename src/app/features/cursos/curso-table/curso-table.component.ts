import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Curso } from 'src/app/core/models/curso';
import { CursoService } from 'src/app/core/services/curso.service';
import { CursoDialogComponent } from '../curso-dialog/curso-dialog.component';

@Component({
  selector: 'app-curso-table',
  templateUrl: './curso-table.component.html',
  styleUrls: ['./curso-table.component.scss']
})
export class CursoTableComponent implements AfterViewInit, OnDestroy {

  @ViewChild(MatSort)
  private sort!: MatSort;
  public dataSource: MatTableDataSource<Curso>;
  public displayedColumns: string[] = ['id', 'materia', 'profesor', 'alumnos', 'modificar', 'eliminar'];
  public loading: boolean;
  private subscriptions!: Subscription[];

  constructor(private cursoService: CursoService, private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.subscriptions = [];
    this.dataSource = new MatTableDataSource<Curso>();
    this.obtenerCursos();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  obtenerCursos(): void {
    this.subscriptions.push(this.cursoService.obtenerCursos().subscribe({
      next: (cursos) => {
        console.log(cursos);
        cursos.forEach((curso) => {
          this.cursoService.obtenerAlumnos(curso.id).subscribe((alumnos) => curso.alumnos = alumnos);
          if (curso.idProfesor)
            this.cursoService.obtenerProfesor(curso.idProfesor).subscribe((profesor) => curso.profesor = profesor);
        });
        this.dataSource.data = cursos;
        this.dataSource.sort = this.sort;
        this.loading = false;
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

  altaCurso(): void {
    const dialog = this.dialogService.open(CursoDialogComponent);
    this.subscriptions.push(dialog.afterClosed().subscribe((curso: Curso) => {
      if (curso?.id && curso?.materia && curso?.idProfesor) {
        this.cursoService.altaCurso(curso).subscribe((c) => this.showSnackBar("Curso ID: " + c.id + " creado."));
      }
    }));
  }

  eliminarCurso(curso: Curso): void {
    this.subscriptions.push(this.cursoService.eliminarCurso(curso).subscribe((c) => {
      // this.obtenerCursos();
      this.showSnackBar("Curso ID: " + c.id + " eliminado.")
    }));
  }

  modificarCurso(curso: Curso): void {
    const dialog = this.dialogService.open(CursoDialogComponent, { data: curso });
    this.subscriptions.push(dialog.afterClosed().subscribe((cursoModificado) => {
      if (cursoModificado?.materia && cursoModificado?.profesor) {
        // this.obtenerCursos();
        this.cursoService.modificarCurso(cursoModificado).subscribe((c) => {
          this.showSnackBar("Curso ID: " + c.id + " modificado.");
        })
      }
    }));
  }

  showSnackBar(message: string) {
    this._snackBar.open(message, "cerrar", {
      duration: 3000,
    });
  }

}
