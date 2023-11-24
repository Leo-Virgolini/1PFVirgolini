import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { MenuComponent } from './menu/menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FeaturesModule } from '../features/features.module';

import { LayoutComponent } from './layout.component';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    // RouterModule,
    // MatButtonModule,
    // MatIconModule,
    FeaturesModule
  ],
  exports: [
    // LayoutComponent,
    // HeaderComponent,
    // FooterComponent,
    // MenuComponent,
    // MainComponent
  ]
})
export class LayoutModule { }
