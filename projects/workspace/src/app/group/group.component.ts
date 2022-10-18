import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  NgFlowchart,
  NgFlowchartCanvasDirective,
  NgFlowchartStepComponent,
} from 'projects/ng-flowchart/src';
import { DropDataService } from 'projects/ng-flowchart/src/lib/services/dropdata.service';

export type NestedData = {
  nested: any;
};

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent
  extends NgFlowchartStepComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(NgFlowchartCanvasDirective)
  nestedCanvas: NgFlowchartCanvasDirective;

  @ViewChild('canvasContent')
  stepContent: ElementRef<HTMLElement>;

  callbacks: NgFlowchart.Callbacks = {
    afterRender: () => {
      this.canvas.reRender(true);
    },
  };

  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'CENTER',
    zoom: {
      mode: 'DISABLED',
    },
  };

  name: string;
  constructor(
    private dropDataService: DropDataService,
    private toastr: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    let groupCount = this.dropDataService.getGroupCount() + 1;
    this.dropDataService.setGroupCount(groupCount);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.addAlternateClass();
  }

  ngOnDestroy() {
    this.nestedCanvas?.getFlow().clear();
  }

  // add nested-alt class to alternate nested flows for better visibility
  addAlternateClass(): void {
    const parentCanvasWrapperClasses = (
      this.canvas.viewContainer.element.nativeElement as HTMLElement
    ).parentElement.classList;
    if (
      parentCanvasWrapperClasses.contains('nested-flow-step') &&
      !parentCanvasWrapperClasses.contains('nested-alt')
    ) {
      this.nativeElement.classList.add('nested-alt');
    }
  }

  shouldEvalDropHover(coords: number[], stepToDrop: NgFlowchart.Step): boolean {
    const canvasRect = this.stepContent.nativeElement.getBoundingClientRect();
    return !this.areCoordsInRect(coords, canvasRect);
  }

  toJSON() {
    const json = super.toJSON();
    return {
      ...json,
      data: {
        ...this.data,
        nested: this.nestedCanvas.getFlow().toObject(),
      },
    };
  }

  canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    let grountCount = this.dropDataService.getGroupCount();
    if (dropEvent == null) {
      let check = true;
      if (grountCount > 1) {
        this.toastr.warning('You cannot drop a group inside a group');
        check = false;
      }
      return check;
    }
    else if (dropEvent.position === 'LEFT' || dropEvent.position === 'RIGHT') {

      this.toastr.warning("You cannot have two groups in the same level");

    }
    else if (dropEvent.step.type == 'group-flow') {
      return true;
    } else {
      this.toastr.warning('You cannot drop a group inside a group');
      return false;
    }
  }

  canDeleteStep(): boolean {
    return true;
  }

  async onUpload(data: NestedData) {
    if (!this.nestedCanvas) {
      return;
    }
    await this.nestedCanvas.getFlow().upload(data.nested);
  }

  private areCoordsInRect(coords: number[], rect: Partial<DOMRect>): boolean {
    return (
      this.isNumInRange(coords[0], rect.left, rect.left + rect.width) &&
      this.isNumInRange(coords[1], rect.top, rect.top + rect.height)
    );
  }

  private isNumInRange(num: number, start: number, end: number): boolean {
    return num >= start && num <= end;
  }

  delete() {
    this.destroy(false);
    let grountCount = this.dropDataService.getGroupCount();
    this.dropDataService.setGroupCount(--grountCount);
  }

  onEdit() {
    this.data.name = this.name;
  }


}
