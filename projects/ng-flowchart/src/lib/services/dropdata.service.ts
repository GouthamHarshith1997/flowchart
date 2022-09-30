import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NgFlowchart } from '../model/flow.model';

@Injectable({
  providedIn: 'root',
})
export class DropDataService {
  dragStep: NgFlowchart.PendingStep | NgFlowchart.MoveStep;

  public GroupCheck = new Subject<any>();

  constructor() {}

  public setDragStep(ref: NgFlowchart.PendingStep) {
    this.dragStep = ref;
  }

  public getDragStep() {
    return this.dragStep;
  }

  sendGroupData(projectData) {
    this.GroupCheck.next({ projectData });
  }

  getGroupCheck(): Observable<any> {
    return this.GroupCheck.asObservable();
  }
}
