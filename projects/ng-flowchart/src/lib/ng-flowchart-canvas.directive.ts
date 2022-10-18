import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { NgFlowchart } from './model/flow.model';
import { CONSTANTS } from './model/flowchart.constants';
import { NgFlowchartCanvasService } from './ng-flowchart-canvas.service';
import { CanvasRendererService } from './services/canvas-renderer.service';
import { ToastrService } from 'ngx-toastr';
import { OptionsService } from './services/options.service';
import { StepManagerService } from './services/step-manager.service';
import { DropDataService as DragService } from './services/dropdata.service';



@Directive({
    selector: '[ngFlowchartCanvas]',
    providers: [
        NgFlowchartCanvasService,
        StepManagerService,
        OptionsService,
        CanvasRendererService
    ]
})
export class NgFlowchartCanvasDirective implements OnInit, OnDestroy, AfterViewInit {

    @HostListener('drop', ['$event'])
    protected onDrop(event: DragEvent) {
        console.log(event);
        if (this._disabled) {
            console.log("inside if")
             return; 
        }

        // its possible multiple canvases exist so make sure we only move/drop on the closest one
        const closestCanvasId = (event.target as HTMLElement).closest('.ngflowchart-canvas-content')?.id
        if (this._id !== closestCanvasId) {
            return;
        }

        const type = event.dataTransfer.getData('type');
        
        let currentDraggingElement = this.drag.getDragStep();
        if ('FROM_CANVAS' == type) {
            // if(currentDraggingElement.type == 'group-flow')
            // {
            //     this.toaster.warning("you cannot change the position of the group");
            // }
            // else{
                console.log("current dragging step", currentDraggingElement);
                this.canvas.moveStep(event, event.dataTransfer.getData('id'));
            // }
          
        }
        else {
            this.canvas.onDrop(event);
        }

    }

    @HostListener('dragover', ['$event'])
    protected onDragOver(event: DragEvent) {
        event.preventDefault();
    //   console.log("over..", this._disabled)
        if (this._disabled) { return; }
        this.canvas.onDragStart(event);
    }

    _options: NgFlowchart.Options;
    _callbacks: NgFlowchart.Callbacks;

    @HostListener('window:resize', ['$event'])
    protected onResize(event) {
        if (this._options.centerOnResize) {
            this.canvas.reRender(true);
        }
        if(this._options.zoom.rescaleOnResize) {

        }
    }

    @HostListener('wheel', ['$event'])
    protected onZoom(event) {
        if (this._options.zoom.mode === 'WHEEL') {
            this.adjustScale(event)
        }
    }

    @Input('ngFlowchartCallbacks')
    set callbacks(callbacks: NgFlowchart.Callbacks) {
        this.optionService.setCallbacks(callbacks);
    }

    @Input('ngFlowchartOptions')
    set options(options: NgFlowchart.Options) {
        this.optionService.setOptions(options);
        this._options = this.optionService.options;
        this.canvas.reRender();

    }

    get options() {
        return this._options
    }

    @Input('disabled')
    @HostBinding('attr.disabled')
    set disabled(val: boolean) {
        this._disabled = val !== false;
        if (this.canvas) {
            this.canvas._disabled = this._disabled;
        }
    }

    get disabled() {
        return this._disabled;
    }

    private _disabled: boolean = false;
    private _id: string = null
    private canvasContent: HTMLElement;
    private _scaleVal: number = 1;
    private scaleDebounceTimer

    constructor(
        protected canvasEle: ElementRef<HTMLElement>,
        private viewContainer: ViewContainerRef,
        private canvas: NgFlowchartCanvasService,
        private optionService: OptionsService,
        private drag : DragService,
        private toaster : ToastrService
    ) {

        this.canvasEle.nativeElement.classList.add(CONSTANTS.CANVAS_CLASS);
        this.canvasContent = this.createCanvasContent(this.viewContainer);
        this._id = this.canvasContent.id

    }

    ngOnInit() {
        this.canvas.init(this.viewContainer);
        if (!this._options) {
            this.options = new NgFlowchart.Options();
        }

        this.canvas._disabled = this._disabled;
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {

        for (let i = 0; i < this.viewContainer.length; i++) {
            this.viewContainer.remove(i)
        }
        this.canvasEle.nativeElement.remove()
        this.viewContainer.element.nativeElement.remove()
        this.viewContainer = undefined
    }

    private createCanvasContent(viewContainer: ViewContainerRef): HTMLElement {
        const canvasId = 'c' + Date.now();

        let canvasEle = viewContainer.element.nativeElement as HTMLElement;
        let canvasContent = document.createElement('div');
        canvasContent.id = canvasId;
        canvasContent.classList.add(CONSTANTS.CANVAS_CONTENT_CLASS);
        canvasEle.appendChild(canvasContent);
        return canvasContent
    }

    /**
     * Returns the Flow object representing this flow chart.
     */
    public getFlow() {
        return new NgFlowchart.Flow(this.canvas);
    }

    public scaleDown() {
        this.canvas.scaleDown()
    }

    public scaleUp() {
        this.canvas.scaleUp()
    }

    public setScale(scaleValue: number) {
        
        const scaleVal = Math.max(0, scaleValue)
        this.canvas.setScale(scaleVal)
    }

    private adjustWheelScale(event) {

        if (this.canvas.flow.hasRoot()) {
            event.preventDefault();
            // scale down / zoom out
            if (event.deltaY > 0) {
                this.scaleDown()
            }
            // scale up / zoom in
            else if (event.deltaY < 0) {
                this.scaleUp()
            }

        }
    };

    private adjustScale(event) {
console.log(event);

        if (this.canvas.flow.hasRoot()) {
            event.preventDefault();
            // scale down / zoom out
console.log(this._scaleVal);
let zoom = 1;
      const ZOOM_SPEED = 0.1;
            // if(event.deltaY > 0) {
            //     this._scaleVal -= this._scaleVal * .1
            // }
            // scale up / zoom in
            //  if(event.deltaY < 0) {
            //     this._scaleVal += this._scaleVal * .1
            // }
            const minDimAdjust = `${1/this._scaleVal * 100}%`
            if(event.deltaY > 0)
            {
                this.canvasContent.style.transform = `scale(${(this._scaleVal += ZOOM_SPEED)})`;
            }
            else{
                this.canvasContent.style.transform = `scale(${(this._scaleVal -= ZOOM_SPEED)})`;
            }
            this.canvasContent.style.transform = `scale(${this._scaleVal})`;
            this.canvasContent.style.minHeight = minDimAdjust
            this.canvasContent.style.minWidth = minDimAdjust
            this.canvasContent.style.transformOrigin = 'top left'
            this.canvasContent.classList.add('scaling')

            // this.canvas.setScale(this._scaleVal)
            // this.canvas.reRender(true)

            this.scaleDebounceTimer && clearTimeout(this.scaleDebounceTimer)
            this.scaleDebounceTimer = setTimeout(() => {
                this.canvasContent.classList.remove('scaling')
            }, 300)
        }
    };

}