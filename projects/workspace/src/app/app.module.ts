import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgFlowchartModule } from 'projects/ng-flowchart/src/lib/ng-flowchart.module';
import { AppComponent } from './app.component';
import { CustomStepComponent } from './custom-step/custom-step.component';
import { RouteStepComponent } from './custom-step/route-step/route-step.component';
import { NestedFlowComponent } from './nested-flow/nested-flow.component';
import { FormStepComponent } from './form-step/form-step.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GroupComponent } from './group/group.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { FreeDraggingDirective } from './free-dragging.direcetive';


@NgModule({
  declarations: [
    AppComponent,
    CustomStepComponent,
    RouteStepComponent,
    NestedFlowComponent,
    FormStepComponent,
    GroupComponent,FreeDraggingDirective
  ],
  imports: [
    BrowserModule,
    NgFlowchartModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(), // ToastrModule added
  ],
  exports: [
    FormsModule,
    FreeDraggingDirective,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
