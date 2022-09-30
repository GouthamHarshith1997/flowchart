import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgFlowchart } from './model/flow.model';
import { DropDataService } from './services/dropdata.service';
import { ToastrService } from 'ngx-toastr';

@Directive({
    selector: '[ngFlowchartStep]'
})
export class NgFlowchartStepDirective implements AfterViewInit, OnDestroy {

    subscription: Subscription;
    
    @HostListener('dragstart', ['$event'])
    onDragStart(event: DragEvent) {
            let booleanCheck = { "true": true, "false":  false, null : null}
            let groupCheck =  JSON.parse(localStorage.getItem("groupData"));
            if(booleanCheck[groupCheck['isGroupExist']])
            {
                if(this.flowStep.data.name.includes("Group"))
                {
                    console.log("inside if : ", this.flowStep);
                    this.flowStep.data.groupCount = this.flowStep.data.groupCount + 1;
                }
                this.data.setDragStep(this.flowStep);
                event.dataTransfer.setData('type', 'FROM_PALETTE');
            }
            else
            {
                if(this.flowStep.data.name === 'Group')
                {
                    console.log("inside else : ", this.flowStep)
                    let groupData  = { isGroupExist : true, groupCount :  1 };
                    localStorage.setItem("groupData", JSON.stringify(groupData));
                    this.data.setDragStep(this.flowStep);
                    event.dataTransfer.setData('type', 'FROM_PALETTE');
                }
                else
                {
                    this.toastr.warning('You need to create a Group first');
                }
            }      
       
    }

    @HostListener('dragend', ['$event'])
    onDragEnd(event: DragEvent) {
       this.data.setDragStep(null);
    }

    @Input('ngFlowchartStep')
    flowStep: NgFlowchart.PendingStep;

    constructor(
        protected element: ElementRef<HTMLElement>,
        private data: DropDataService, 
        private toastr: ToastrService
    ) {
        this.element.nativeElement.setAttribute('draggable', 'true');
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
          }   
    }

    ngAfterViewInit() {
    }
}