import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Alumno } from 'src/app/core/models/alumno';
import { Curso } from 'src/app/core/models/curso';
import { Inscripcion } from 'src/app/core/models/inscripcion';
import { Profesor } from 'src/app/core/models/profesor';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { CursoService } from 'src/app/core/services/curso.service';
import { InscripcionService } from 'src/app/core/services/inscripcion.service';
import { ProfesorService } from 'src/app/core/services/profesor.service';

@Component({
  selector: 'app-curso-dialog',
  templateUrl: './curso-dialog.component.html',
  styleUrls: ['./curso-dialog.component.scss']
})
export class CursoDialogComponent implements OnInit, OnDestroy {

  public formulario!: FormGroup;
  private subscriptions!: Subscription[];
  public loading: boolean;
  public submitted: boolean;

  public profesores!: Profesor[];
  public alumnos!: Alumno[];
  public cursoId!: number;

  constructor(private cursoService: CursoService, private profesorService: ProfesorService, private alumnoService: AlumnoService, private inscripcionService: InscripcionService,
    private formBuilder: FormBuilder, private dialogRef: MatDialogRef<CursoDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Curso | null) {
    this.loading = true;
    this.submitted = false;
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.subscriptions.push(this.profesorService.obtenerProfesores().subscribe((profesores) => this.profesores = profesores));
    this.subscriptions.push(this.alumnoService.obtenerAlumnos().subscribe((alumnos) => {
      this.alumnos = alumnos;
      this.formulario = this.formBuilder.group({
        materia: ['', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]],
        profesor: ['', [Validators.required]],
        alumnos: this.alumnos ? this.formBuilder.array(this.alumnos.map(() =>
          this.formBuilder.control(false))) : this.formBuilder.array([])
      });
      console.log(this.data);
      if (this.data) {
        const curso: Curso = this.data;
        this.cursoId = curso.id;
        this.subscriptions.push(this.cursoService.obtenerAlumnos(curso.id).subscribe(alumnos => {
          curso.alumnos = alumnos;
          let selectedAlumnos: boolean[] = [];
          if (alumnos)
            selectedAlumnos = this.alumnos.map(alumno => alumnos.findIndex(selectedAlumno => selectedAlumno?.id == alumno?.id) > -1);
          this.formulario.get('alumnos')?.patchValue(selectedAlumnos);
        }));
        if (curso.idProfesor)
          this.subscriptions.push(this.cursoService.obtenerProfesor(curso.idProfesor).subscribe(profesor => this.formulario.get('profesor')?.patchValue(profesor)));
        this.formulario.get('materia')?.patchValue(curso.materia);
      }
      this.loading = false;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onSubmit(): void {
    this.formulario.markAllAsTouched();
    this.submitted = true;
    if (this.formulario.valid) {
      console.log(this.formulario.value);
      console.log(this.data);
      if (this.data) { // Modificacion
        this.modificarCurso();
      } else { // Alta
        this.altaCurso();
      }
    }
  }

  private modificarCurso(): void {
    const curso: Curso | null = this.data;
    if (curso) {
      curso.materia = this.formulario.get('materia')?.value;
      curso.idProfesor = this.formulario.get('profesor')?.value.id;
      const alumnosSeleccionados: Alumno[] = this.alumnos.filter((_alumno, index) => this.formulario?.get('alumnos')?.value[index] == true);
      // Add Inscripciones for newly selected Alumnos
      alumnosSeleccionados.forEach(alumno => {
        if (!curso.alumnos?.includes(alumno)) {
          this.subscriptions.push(this.inscripcionService.altaInscripcion(new Inscripcion(0, curso.id, alumno.id)).subscribe((i) => console.log(i)));
        }
      });
      // Remove Inscripciones for deselected Alumnos
      curso.alumnos?.forEach(alumno => {
        if (!alumnosSeleccionados.includes(alumno)) {
          this.subscriptions.push(this.inscripcionService.obtenerInscripcionPorCursoAlumno(curso.id, alumno.id).subscribe((inscripcion) => {
            if (inscripcion) {
              this.subscriptions.push(this.inscripcionService.eliminarInscripcion(inscripcion).subscribe((i) => console.log(i)));
            }
          }));
        }
      });
      curso.alumnos = alumnosSeleccionados;
      this.dialogRef.close(curso);
    }
  }

  private altaCurso(): void {
    this.subscriptions.push(this.cursoService.obtenerCursos()
      .pipe(
        switchMap(cursos => {
          const alumnos = this.alumnos.filter((alumno, index) => this.formulario?.get('alumnos')?.value[index] == true);
          const curso: Curso = new Curso(0,
            this.formulario.get('materia')?.value,
            this.formulario.get('profesor')?.value.id
          );
          alumnos.forEach(alumno => {
            this.subscriptions.push(this.inscripcionService.altaInscripcion(new Inscripcion(0, curso.id, alumno.id)).subscribe((i) => console.log(i)));
          });
          return of(curso);
        })
      ).subscribe((cursoModificado) => {
        this.dialogRef.close(cursoModificado);
      }));
  }

  compareFn(p1: Profesor, p2: Profesor): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

}