import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgFlowchart, NgFlowchartCanvasDirective, NgFlowchartStepComponent } from 'projects/ng-flowchart/src';
import { DropDataService } from 'projects/ng-flowchart/src/lib/services/dropdata.service';

export type NestedData = {
  nested: any
}

@Component({
  selector: 'app-nested-flow',
  templateUrl: './nested-flow.component.html',
  styleUrls: ['./nested-flow.component.scss']
})
export class NestedFlowComponent extends NgFlowchartStepComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(NgFlowchartCanvasDirective)
  nestedCanvas: NgFlowchartCanvasDirective;

  @ViewChild('canvasContent')
  stepContent: ElementRef<HTMLElement>;

  callbacks: NgFlowchart.Callbacks = {
    afterRender: () => {
      this.canvas.reRender(true)
    }
  };

  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER',
    zoom: {
      mode: 'DISABLED'
    }
  }

  name: string;
  constructor(private dataService: DropDataService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.addAlternateClass();
  }

  ngOnDestroy() {
    this.nestedCanvas?.getFlow().clear()
  }

  // add nested-alt class to alternate nested flows for better visibility
  addAlternateClass(): void {
    const parentCanvasWrapperClasses = (this.canvas.viewContainer.element.nativeElement as HTMLElement).parentElement.classList;
    if (parentCanvasWrapperClasses.contains('nested-flow-step') && !parentCanvasWrapperClasses.contains('nested-alt')) {
      this.nativeElement.classList.add('nested-alt');
    }
  }

  shouldEvalDropHover(coords: number[], stepToDrop: NgFlowchart.Step): boolean {
    const canvasRect = this.stepContent.nativeElement.getBoundingClientRect()
    return !this.areCoordsInRect(coords, canvasRect)
  }

  toJSON() {
    const json = super.toJSON()
    return {
      ...json,
      data: {
        ...this.data,
        nested: this.nestedCanvas.getFlow().toObject()
      }
    }
  }

  canDrop(dropEvent: NgFlowchart.DropTarget): boolean {

    if (dropEvent == null) {

      return true;

    }

    else if (dropEvent.step.type === 'group-flow') {

      this.toastr.warning("Cannot drop steps outside the group");

      return false;

    }

    else {

      return true;

    }

  }

  canDeleteStep(): boolean {
    return true;
  }



  async onUpload(data: NestedData) {
    if (!this.nestedCanvas) {
      return
    }
    await this.nestedCanvas.getFlow().upload(data.nested);
  }

  private areCoordsInRect(coords: number[], rect: Partial<DOMRect>): boolean {
    return this.isNumInRange(coords[0], rect.left, rect.left + rect.width) && this.isNumInRange(coords[1], rect.top, rect.top + rect.height)
  }

  private isNumInRange(num: number, start: number, end: number): boolean {
    return num >= start && num <= end
  }

  onDragStart(event) {
    let dragCheck = this.dataService.getActiveStepDroppingFlag();

    if (dragCheck) {

      return;

    }
    console.log(this.data);

    let obj = {
      id: this.id,
      data: this.data,
      drag: event,
      instance: this
    }
    console.log(obj);
    this.dataService.setActiveStep(obj);
  }

  delete() {
    this.destroy(false);
  }

  onEdit() {
    this.data.name = this.name;
  }
}
