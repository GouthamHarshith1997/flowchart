import { Component } from '@angular/core';
import { NgFlowchartStepComponent } from 'projects/ng-flowchart/src/lib/ng-flowchart-step/ng-flowchart-step.component';
import { NgFlowchart } from 'projects/ng-flowchart/src';
import { RouteStepComponent } from './route-step/route-step.component';
import { DropDataService } from 'projects/ng-flowchart/src/lib/services/dropdata.service';

@Component({
  selector: 'app-custom-step',
  templateUrl: './custom-step.component.html',
  styleUrls: ['./custom-step.component.scss']
})
export class CustomStepComponent extends NgFlowchartStepComponent {

  routes = [];
  name: string = '';

  constructor(private  dataService : DropDataService ) { 
    super()
  }

  
  ngOnInit(): void {
  }

  canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }

  canDeleteStep(): boolean {
    return true;
  }

  getDropPositionsForStep(pendingStep: NgFlowchart.PendingStep): NgFlowchart.DropPosition[] {
    if (pendingStep.template !== RouteStepComponent) {
      return ['ABOVE', 'LEFT', 'RIGHT'];
    }
    else {
      return ['BELOW'];
    }
  }

  onAddRoute() {
    let route = {
      name: 'New Route',
      condition: '',
      sequence: null
    }
    let index = this.routes.push(route);
    route.sequence = index;

    this.addChild({
      template: RouteStepComponent,
      type: 'route-step',
      data: route
    }, {
      sibling: true
    });
  }

  delete() {
    //recursively delete
    this.destroy(false);
  }

  onEdit()
  {
    console.log("inside edit", this.data);
    this.data.name =  this.name;
  }

  
  onDragStart(event)
  {
    console.log("drag started", event);
    console.log(this);
    console.log(this.data)
    let obj = {
      id : this.id,
      data :  this.data,
      drag :  event,
      instance:  this
    }
    console.log(obj);
    this.dataService.setActiveStep(obj);
  }

}
