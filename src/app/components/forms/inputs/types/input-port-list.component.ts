import {Component, Input, Output, EventEmitter} from "@angular/core";
import {InputProperty} from "../../../../models/input-property.model";
import {SidebarType} from "../../../sidebar/shared/sidebar.type";
import {SidebarEvent, SidebarEventType} from "../../../sidebar/shared/sidebar.events";
import {CltEditorService} from "../../../clt-editor/shared/clt-editor.service";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: "input-port-list",
    template: `
            <div *ngIf="portList.length > 0">
            
                <div class="row">
                    <div class="col-sm-2">
                    </div>
                    <div class="col-sm-3">
                        ID               
                    </div>
                    <div class="col-sm-1">
                        Type
                    </div>
                    <div class="col-sm-4">
                        Value
                    </div>
                </div>

                 <div class="row tool-input-row" *ngFor="let inputPort of portList">  
                    <div class="col-sm-2">
                        <i class="fa fa-align-justify tool-input-icon" aria-hidden="true"></i>
                    </div>
                    <div class="col-sm-3">
                        {{inputPort.id}}         
                    </div>
                    <div class="col-sm-1">
                        {{inputPort.type}}      
                    </div>
                    
                    <div class="col-sm-4">
                        {{inputPort.value}}     
                    </div>
                    
                    <div class="col-sm-1 icons-right-side">
                        <i class="fa fa-pencil tool-input-icon" 
                           aria-hidden="true" 
                           (click)="editProperty(inputPort)"></i>
                    </div>
                    
                    <div class="col-sm-1 icons-right-side tool-input-icon">
                        <i class="fa fa-times" 
                           aria-hidden="true"
                           (click)="removeProperty(inputPort)"></i>
                    </div>
                </div>
                
        </div> <!-- List end -->
        
         <div *ngIf="portList.length === 0" class="col-sm-12">
                No input ports defined.
        </div>
    `
})
export class InputPortListComponent {
    @Input()
    private portList: Array<InputProperty>;

    @Output()
    private portListChange: EventEmitter<Array<InputProperty>> = new EventEmitter<Array<InputProperty>>();

    private selectedInputPort: BehaviorSubject<InputProperty> = new BehaviorSubject<InputProperty>(undefined);

    constructor(private guiEditorService: CltEditorService) { }

    editProperty(inputPort: InputProperty): void {
        this.selectedInputPort.next(inputPort);

        let editPropertySidebarEvent: SidebarEvent = {
            sidebarEventType: SidebarEventType.Show,
            sidebarType: SidebarType.ObjectInspector,
            data: {
                stream: this.selectedInputPort
            }
        };

        this.guiEditorService.sidebarEvents.next(editPropertySidebarEvent);
    }

    removeProperty(inputPort: InputProperty): void {
        /** TODO: figure out how we want to identify our inputs */
        if (!inputPort.id) {
            return;
        }

        this.portList = this.portList.filter((prop: InputProperty) => {
            return inputPort.id !== prop.id;
        });

        this.portListChange.emit(this.portList);
        
        this.guiEditorService.sidebarEvents.next({
            sidebarEventType: SidebarEventType.Hide
        });
    }
}
