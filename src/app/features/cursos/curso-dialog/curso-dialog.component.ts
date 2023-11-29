import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, forkJoin } from 'rxjs';
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

  private subscriptions!: Subscription[];
  public formulario!: FormGroup;
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
    const obtenerProfesores$ = this.profesorService.obtenerProfesores();
    const obtenerAlumnos$ = this.alumnoService.obtenerAlumnos();
    this.subscriptions.push(forkJoin({ profesores: obtenerProfesores$, alumnos: obtenerAlumnos$ }).subscribe(({ profesores, alumnos }) => {
      this.profesores = profesores;
      this.alumnos = alumnos;
      this.formulario = this.formBuilder.group({
        materiaControl: ['', [Validators.required, Validators.pattern('^[a-zA-ZÁ-Úá-ú ]+$'), Validators.minLength(2), Validators.maxLength(20)]],
        profesorControl: [''],
        alumnosControl: this.alumnos ? this.formBuilder.array(this.alumnos.map(() => this.formBuilder.control(false))) : this.formBuilder.array([])
      });
      console.log(this.data);
      if (this.data) {
        const curso: Curso = this.data;
        this.cursoId = curso.id;
        if (curso.alumnos) {
          const selectedAlumnos: boolean[] = this.alumnos.map(alumno => curso.alumnos!.findIndex(selectedAlumno => selectedAlumno?.id == alumno?.id) > -1);
          this.formulario.get('alumnosControl')?.patchValue(selectedAlumnos);
        }
        this.formulario.get('profesorControl')?.patchValue(curso.profesor);
        this.formulario.get('materiaControl')?.patchValue(curso.materia);
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
      if (this.data) {
        this.modificarCurso();
      } else {
        this.altaCurso();
      }
    }
  }

  private modificarCurso(): void {
    const curso: Curso | null = this.data;
    if (curso) {
      curso.materia = this.formulario.get('materiaControl')?.value;
      curso.profesor = this.formulario.get('profesorControl')?.value;
      const alumnosSeleccionados: Alumno[] = this.alumnos.filter((_alumno, index) => this.formulario?.get('alumnosControl')?.value[index] == true);
      // Add Inscripciones for newly selected Alumnos
      alumnosSeleccionados.forEach(alumno => {
        if (!curso.alumnos?.some(a => a.id === alumno.id)) {
          this.inscripcionService.altaInscripcion(new Inscripcion(0, curso, alumno)).subscribe((i) => console.log("inscripcion alta", i));
        }
      });
      // Remove Inscripciones for deselected Alumnos
      curso.alumnos?.forEach(alumno => {
        if (!alumnosSeleccionados.some(a => a.id === alumno.id)) {
          this.subscriptions.push(this.inscripcionService.obtenerInscripcionPorCursoAlumno(curso, alumno).subscribe((inscripcion) => {
            if (inscripcion) {
              this.inscripcionService.eliminarInscripcion(inscripcion).subscribe((i) => console.log("inscripcion baja", i));
            }
          }));
        }
      });
      curso.alumnos = alumnosSeleccionados;
      this.cursoService.modificarCurso(curso).subscribe((c) => {
        this.dialogRef.close(c);
      })
    }
  }

  private altaCurso(): void {
    const alumnos: Alumno[] = this.alumnos.filter((_alumno, index) => this.formulario?.get('alumnosControl')?.value[index] == true);
    const curso: Curso = new Curso(0,
      this.formulario.get('materiaControl')?.value,
      this.formulario.get('profesorControl')?.value || null,
      alumnos || null
    );

    this.dialogRef.close(curso);
  }

  compareFn(p1: Profesor, p2: Profesor): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

}
