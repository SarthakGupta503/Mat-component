import { NgModule } from '@angular/core';
import { MyLibComponent } from './my-lib.component';
// import { PageTemplateComponent } from './page-template/page-template.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule} from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import { MatFormFieldModule} from '@angular/material/form-field';
import {CdkAccordionModule} from '@angular/cdk/accordion'; 
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageTemplate2Component } from './page-template2/page-template2.component';
import { PageTemplate3Component } from './page-template3/page-template3.component';
import { PageTemplate4Component } from './page-template4/page-template4.component';
import { PageTemplate5Component } from './page-template5/page-template5.component';
@NgModule({                
  declarations: [
    MyLibComponent,
    // PageTemplateComponent,
    PageTemplate2Component,
    PageTemplate3Component,
    PageTemplate4Component,
    PageTemplate5Component,
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
    MatCheckboxModule,
    CdkAccordionModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
    MatProgressBarModule,
  ],
  exports: [
    MyLibComponent,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTreeModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressBarModule,
    MatCheckboxModule,
    // PageTemplateComponent,
    PageTemplate2Component,
    PageTemplate3Component,
    PageTemplate4Component
  ]
})
export class MyLibModule { }
