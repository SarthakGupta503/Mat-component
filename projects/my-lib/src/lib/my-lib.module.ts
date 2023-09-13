import { NgModule } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
import { PageTemplateComponent } from './page-template/page-template.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule} from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule} from '@angular/material/form-field'
import {CdkAccordionModule} from '@angular/cdk/accordion'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@NgModule({                
  declarations: [
    MyLibComponent,
    PageTemplateComponent
  ],
  imports: [
    MatInputModule,
    MatButtonModule,
    MatTreeModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    CdkAccordionModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
    MatProgressBarModule
  ],
  exports: [
    MyLibComponent,
    MatButtonModule,
    MatInputModule,
    PageTemplateComponent
  ]
})
export class MyLibModule { }
