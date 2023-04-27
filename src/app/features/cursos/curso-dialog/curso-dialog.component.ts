import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { inscripcionesData } from 'src/app/core/data';
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

  constructor(private cursoService: CursoService, private profesorService: ProfesorService, private alumnoService: AlumnoService, private inscripcionService: InscripcionService, private formBuilder: FormBuilder, private dialogRef: MatDialogRef<CursoDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Curso | null) {
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
          let selectedAlumnos: boolean[];
          if (alumnos)
            selectedAlumnos = this.alumnos.map(alumno => alumnos.findIndex(selectedAlumno => selectedAlumno?.id == alumno?.id) > -1);
          else
            selectedAlumnos = [];
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
        const curso: Curso = this.data;
        if (curso) {
          curso.materia = this.formulario.get('materia')?.value;
          curso.idProfesor = this.formulario.get('profesor')?.value.id;
          const alumnos: Alumno[] = this.alumnos.filter((_alumno, index) => this.formulario?.get('alumnos')?.value[index] == true);
          alumnos.forEach(alumno => {
            let ultimoId: number;
            if (inscripcionesData.length > 0)
              ultimoId = Number(inscripcionesData[inscripcionesData.length - 1].id);
            else
              ultimoId = 0;
            this.subscriptions.push(this.inscripcionService.modificarInscripcion(new Inscripcion(ultimoId, curso.id, alumno.id)).subscribe((i) => console.log(i)));
          });
          this.subscriptions.push(this.cursoService.modificarCurso(curso).subscribe((c) => {
            this.dialogRef.close(c);
          }));
        }
      } else { // Alta
        this.subscriptions.push(this.cursoService.obtenerCursos().pipe(
          switchMap(cursos => {
            let ultimoIdCurso: number;
            if (cursos.length > 0)
              ultimoIdCurso = cursos[cursos.length - 1].id;
            else
              ultimoIdCurso = 0;
            const alumnos = this.alumnos.filter((alumno, index) => this.formulario?.get('alumnos')?.value[index] == true);
            const curso: Curso = new Curso(ultimoIdCurso + 1,
              this.formulario.get('materia')?.value,
              this.formulario.get('profesor')?.value.id
            );
            alumnos.forEach(alumno => {
              let ultimoIdInscripcion: number;
              if (inscripcionesData.length > 0)
                ultimoIdInscripcion = Number(inscripcionesData[inscripcionesData.length - 1].id);
              else
                ultimoIdInscripcion = 0;
              this.subscriptions.push(this.inscripcionService.altaInscripcion(new Inscripcion(ultimoIdInscripcion, curso.id, alumno.id)).subscribe((i) => console.log(i)));
            });
            return this.cursoService.altaCurso(curso);
          })
        ).subscribe((c) => {
          this.dialogRef.close(c);
        }));
      }
    }
  }

  compareFn(p1: Profesor, p2: Profesor): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

}
