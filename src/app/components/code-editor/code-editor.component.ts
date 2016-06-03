import {Component, OnInit, ElementRef} from "@angular/core";
import {CodeEditor} from "./code-editor.service";
import {FileRegistry, File} from "../../services/file-registry.service";
import {BlockLoaderComponent} from "../block-loader/block-loader.component";
import Editor = AceAjax.Editor;
import TextMode = AceAjax.TextMode;

require('./code-editor.component.scss');

@Component({
    selector: 'code-editor',
    directives: [BlockLoaderComponent],
    template: `
                <div class="code-editor-container">
                     <block-loader *ngIf="editor.fileIsLoading"></block-loader>
                     <div class="editor" [hidden]="editor.fileIsLoading "></div>
                </div>`,
})
export class CodeEditorComponent implements OnInit {
    editor: CodeEditor;
    file: File;

    constructor(private elem: ElementRef, private fileRegistry: FileRegistry) {}

    ngOnInit(): any {
        let editorInstance = ace.edit(this.elem.nativeElement.getElementsByClassName('editor')[0]);
        this.editor        = new CodeEditor(editorInstance);

        // this check shouldn't be necessary
        if (this.file) {
            this.editor.setMode(this.file.type);
            this.editor.setTextStream(this.fileRegistry.fetchFileContent(this.file));
        }
    }

    ngOnDestroy(): any {
        this.editor.dispose();
    }

    public setState(state) {
        // @todo figure out why this is undefined on startup
        if (state.fileInfo) {
            this.file = new File(state.fileInfo);
        }
    }
}