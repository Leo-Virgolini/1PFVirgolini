import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from 'src/app/core/models/usuario';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { UsuarioDialogComponent } from '../usuario-dialog/usuario-dialog.component';
import { AlumnoService } from 'src/app/core/services/alumno.service';
import { ProfesorService } from 'src/app/core/services/profesor.service';
import { Alumno } from 'src/app/core/models/alumno';
import { Profesor } from 'src/app/core/models/profesor';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-usuario-table',
  templateUrl: './usuario-table.component.html',
  styleUrls: ['./usuario-table.component.scss']
})
export class UsuarioTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatSort)
  private sort!: MatSort;
  @ViewChild(MatPaginator)
  private paginator!: MatPaginator;

  public dataSource: MatTableDataSource<Usuario>;
  public readonly displayedColumns: string[] = ['id', 'email', 'password', 'rol', 'token', 'modificar', 'eliminar'];
  public loading: boolean;
  private subscriptions!: Subscription[];

  constructor(private usuarioService: UsuarioService, private alumnoService: AlumnoService, private profesorService: ProfesorService, private dialogService: MatDialog, private _snackBar: MatSnackBar) {
    this.loading = true;
    this.subscriptions = [];
    this.dataSource = new MatTableDataSource<Usuario>();
  }

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => data.email.trim().toLowerCase().startsWith(filter?.trim().toLowerCase());
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  obtenerUsuarios(): void {
    this.loading = true;
    this.subscriptions.push(this.usuarioService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        console.log(usuarios);
        this.dataSource.data = usuarios;
      },
      error: (error) => {
        console.log(error);
        this.showSnackBar("Se ha producido un error al obtener los datos.");
        this.loading = false;
      },
      complete: () => {
        console.log("complete");
        this.dataSource.sort = this.sort;
        this.loading = false;
      }
    }));
  }

  altaUsuario(): void {
    const dialog = this.dialogService.open(UsuarioDialogComponent);
    this.subscriptions.push(dialog.afterClosed().subscribe(
      {
        next: (usuario: Usuario) => {
          if (usuario?.email && usuario?.password && usuario?.rol && usuario?.token) {
            this.obtenerUsuarios();
            this.showSnackBar("Usuario ID: " + usuario.id + " creado.");
          }
        },
        error: (error) => this.showSnackBar("Error: " + error)
      }
    ));
  }

  eliminarUsuario(usuario: Usuario): void {
    if (usuario.rol === 'alumno') {
      this.subscriptions.push(this.alumnoService.eliminarAlumno(usuario as Alumno).subscribe((u) => {
        this.obtenerUsuarios();
        this.showSnackBar("Usuario Alumno ID: " + u.id + " eliminado.");
      }));
    } else if (usuario.rol === 'profesor') {
      this.subscriptions.push(this.profesorService.eliminarProfesor(usuario as Profesor).subscribe((u) => {
        this.obtenerUsuarios();
        this.showSnackBar("Usuario Profesor ID: " + u.id + " eliminado.");
      }));
    }
  }

  modificarUsuario(usuario: Usuario): void {
    const dialog = this.dialogService.open(UsuarioDialogComponent, { data: usuario });
    this.subscriptions.push(dialog.afterClosed().subscribe((u: Usuario) => {
      if (u?.email && u?.password && u?.rol) {
        this.showSnackBar("Usuario ID: " + u.id + " modificado.");
      }
    }));
  }

  openDialog(usuario: Usuario): void {
    const dialog = this.dialogService.open(DialogComponent, {
      data: {
        usuario: usuario
      }
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarUsuario(usuario);
      }
    });
  }

  private showSnackBar(message: string) {
    this._snackBar.open(message, "cerrar", {
      duration: 3000,
    });
  }

}
