import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgFlowchart } from 'projects/ng-flowchart/src';
import { NgFlowchartStepComponent } from 'projects/ng-flowchart/src/lib/ng-flowchart-step/ng-flowchart-step.component';
import { DropDataService } from 'projects/ng-flowchart/src/lib/services/dropdata.service';

export type MyForm = {
  input1: string
}

@Component({
  selector: 'app-form-step',
  templateUrl: './form-step.component.html',
  styleUrls: ['./form-step.component.scss']
})
export class FormStepComponent extends NgFlowchartStepComponent<MyForm> implements OnInit {

  name: string;
  
  constructor(
    private  dataService : DropDataService,
    private toastr: ToastrService ) { 
    super()
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  delete()
  {
    this.destroy(false);
  }

  onEdit()
  {
    this.data['name'] = this.name;
  }

  onDragStart(event)
  {
    this.dataService.setActiveStepDroppingFlag(true);
   
    let obj = {
      id : this.id,
      data :  this.data,
      drag :  event,
      instance:  this
    }
    console.log(obj);
    this.dataService.setActiveStep(obj);
  }
  canDrop(dropEvent: NgFlowchart.DropTarget): boolean {

    if(dropEvent == null)

    {

      return true;

    }

    else if(dropEvent.step.type === 'group-flow')

    {

      this.toastr.warning("Cannot drop steps outside the group");

      return false;

    }

    else

    {

      return true;

    }

  }
  

}

