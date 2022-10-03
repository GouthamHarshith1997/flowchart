import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgFlowchart } from 'projects/ng-flowchart/src/lib/model/flow.model';
import { NgFlowchartStepRegistry } from 'projects/ng-flowchart/src/lib/ng-flowchart-step-registry.service';
import { NgFlowchartCanvasDirective } from 'projects/ng-flowchart/src';
import { CustomStepComponent } from './custom-step/custom-step.component';
import { RouteStepComponent } from './custom-step/route-step/route-step.component';
import { FormStepComponent, MyForm } from './form-step/form-step.component';
import { NestedFlowComponent } from './nested-flow/nested-flow.component';
import { GroupComponent } from './group/group.component';
import { CanvasRendererService } from 'projects/ng-flowchart/src/lib/services/canvas-renderer.service';
import { NgFlowchartCanvasService } from 'projects/ng-flowchart/src/lib/ng-flowchart-canvas.service';
import { DropDataService } from 'projects/ng-flowchart/src/lib/services/dropdata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'workspace';

  callbacks: NgFlowchart.Callbacks = {};
  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER',
    zoom: {
      mode: 'WHEEL',
      rescaleOnResize: true
    }
  }

  @ViewChild('normalStep')
  normalStepTemplate: TemplateRef<any>;

  sampleJson = '{"root":{"id":"s1624206175876","type":"nested-flow","data":{"name":"Nested Flow","nested":{"root":{"id":"s1624206177187","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[{"id":"s1624206178618","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[]},{"id":"s1624206180286","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[]}]}}},"children":[{"id":"s1624206181654","type":"log","data":{"name":"Log","icon":{"name":"log-icon","color":"blue"},"config":{"message":null,"severity":null}},"children":[]}]}}';

  items = [
    {
      name: 'Logger',
      type: 'log',
      data: {
        name: 'Log',
        icon: { name: 'log-icon', color: 'blue' },
        config: {
          message: null,
          severity: null
        }
      }
    }
  ]

  customOps = [
    {
      paletteName: 'Router',
      step: {
        template: CustomStepComponent,
        type: 'router',
        data: {
          name: 'Routing Block'
        }
      }
    },
    {
      paletteName: 'Form Step',
      step: {
        template: FormStepComponent,
        type: 'form-step',
        data: {
          name :  '123'
        }
      }
    },
    {
      paletteName: 'Loop',
      step: {
        template: NestedFlowComponent,
        type: 'nested-flow',
        data: {
          name: 'Nested Flow'
        }
      }
    },
    {
      paletteName: 'Group',
      step: {
        template: GroupComponent,
        type: 'group-flow',
        data: {
          name: 'Group',
          groupCount : 1
        }
      }

    }
  ]



  @ViewChild(NgFlowchartCanvasDirective)
  canvas: NgFlowchartCanvasDirective;

  disabled = false;


  constructor(private stepRegistry: NgFlowchartStepRegistry,
    private renderer: CanvasRendererService,
    private canvas1: NgFlowchartCanvasService,) {
  constructor(private stepRegistry: NgFlowchartStepRegistry, private dropService :  DropDataService) {

    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
    this.callbacks.afterDeleteStep = this.afterDeleteStep;
    this.callbacks.beforeDeleteStep = this.beforeDeleteStep;

    //new code
    let groupData  = { isGroupExist : false, groupCount :  0 }
    localStorage.setItem("groupData", JSON.stringify(groupData));

  }

  ngAfterViewInit() {
    // this.stepRegistry.registerStep('rest-get', this.normalStepTemplate);
    this.stepRegistry.registerStep('log', this.normalStepTemplate);
    this.stepRegistry.registerStep('router', CustomStepComponent);
    this.stepRegistry.registerStep('nested-flow', NestedFlowComponent);
    this.stepRegistry.registerStep('form-step', FormStepComponent);
    this.stepRegistry.registerStep('route-step', RouteStepComponent);
    const zoomElement:any = document.querySelector(".ngflowchart-step-wrapper");
    zoomElement.style.transform = `rotate(270deg)`;
  }

  onDropError(error: NgFlowchart.DropError) {
    console.log(error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.log(error);
  }

  beforeDeleteStep(step) {
    console.log(JSON.stringify(step.children))
  }

  afterDeleteStep(step) {
    console.log(JSON.stringify(step.children))
  }

  showUpload() {
    this.canvas.getFlow().upload(this.sampleJson);
  }

  showFlowData() {

    let json = this.canvas.getFlow().toJSON(4);

    var x = window.open();
    x.document.open();
    x.document.write('<html><head><title>Flowchart Json</title></head><body><pre>' + json + '</pre></body></html>');
    x.document.close();

  }

  clearData() {
    this.canvas.getFlow().clear();

    //new code
    let groupData  = { isGroupExist : false, groupCount :  0 }
    localStorage.setItem("groupData", JSON.stringify(groupData));
    this.dropService.setGroupCount(0);
  }

  onGapChanged(event) {

    this.options = {
      ...this.options,
      stepGap: parseInt(event.target.value)
    };
  }

  onSequentialChange(event) {
    this.options = {
      ...this.options,
      isSequential: event.target.checked
    }
  }

  onDelete(id) {
    console.log("inside on delete");
    this.canvas.getFlow().getStep(id).destroy(true);
  }

  rotateOrientation(degree){
    var testFlow = this.canvas.getFlow();
   var rotateDegree = degree+180;
    const zoomElement:any = document.querySelector(".ngflowchart-step-wrapper");
    zoomElement.style.transform = `rotate(${rotateDegree}deg)`;
    // const groupflowCheck =  JSON.parse(localStorage.getItem("flowLocal"));
    // // console.log(this.canvas.getFlow());
    // console.log(groupflowCheck);
    console.log(testFlow['canvas'].flow);

    // this.renderer.rotateFlow(testFlow['canvas'].flow,270);
    // this.renderer.setScale(testFlow['canvas'].flow,10)

  }
}
