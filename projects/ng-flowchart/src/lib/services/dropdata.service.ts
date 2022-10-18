import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NgFlowchart } from '../model/flow.model';

@Injectable({
  providedIn: 'root',
})
export class DropDataService {
  dragStep: NgFlowchart.PendingStep | NgFlowchart.MoveStep;
  groupCount : number = 0;
  activeStep;

  public GroupCheck = new Subject<any>();
  isActiveStepDropping : boolean = false;
  constructor() {}

  public setActiveStepDroppingFlag(value : boolean)

 {

    this.isActiveStepDropping = value;

 }



 public getActiveStepDroppingFlag()

 {

  return this.isActiveStepDropping;

 }
  public setDragStep(ref: NgFlowchart.PendingStep) {
    this.dragStep = ref;
  }

  public getDragStep() {
    return this.dragStep;
  }
  
  public setGroupCount(count : number)
  {
      this.groupCount =  count;
  }

  public getGroupCount()
  {
    return this.groupCount;
  }

  sendGroupData(projectData) {
    this.GroupCheck.next({ projectData });
  }

  getGroupCheck(): Observable<any> {
    return this.GroupCheck.asObservable();
  }

 public setActiveStep(step)
 {
    this.activeStep = step;
 }

 public getActiveStep()
 {
  return this.activeStep;
 }

 
}
