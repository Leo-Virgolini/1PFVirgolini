import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { getPaginatorIntl } from './shared/paginator/paginator';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from './layout/layout.module';


@NgModule({
  declarations: [
    AppComponent,
    // HeaderComponent,
    // FooterComponent,
    // MenuComponent,
    // MainComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,

    MatIconModule,
    // MatTableModule,
    // MatSortModule,
    // MatDialogModule,
    // MatInputModule,
    // MatFormFieldModule,
    // MatDividerModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatSnackBarModule,
    // MatPaginatorModule,
    // MatButtonModule,
    // MatListModule,
    // MatSelectModule,
    MatSidenavModule,
    MatToolbarModule,
    // MatCheckboxModule,

    LayoutModule,
    // FeaturesModule,
    // CoreModule,
    // SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    { provide: MatPaginatorIntl, useValue: getPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
