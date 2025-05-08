import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { DashboardComponent } from 'src/app/components/layout/dashboard/dashboard.component';
import { FormModel } from 'src/app/model/components/form.model';
import { LayoutModel } from 'src/app/model/components/layout.model';
import { TemplateEditorService } from 'src/app/services/setup-data/template-editor.service';

@Component({
    selector: 'app-template-editor',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        CommonModule,
        DashboardComponent,
        DynamicFormComponent,
    ],
    templateUrl: './template-editor.component.html',
    styleUrl: './template-editor.component.scss'
})
export class TemplateEditorComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    ButtonNavigation: LayoutModel.IButtonNavigation[] = [
        {
            id: 'save',
            title: 'Save',
            icon: 'pi pi-save'
        }
    ];

    FormState: 'insert' | 'update' = 'update';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _messageService: MessageService,
        private _templatEditorService: TemplateEditorService,
    ) {
        this.FormProps = {
            id: 'form_template_editor',
            fields: [
                {
                    id: 'id_template_editor',
                    label: 'ID',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true
                },
                {
                    id: 'template_pesan_invoice',
                    label: 'Pesan Whatsapp Tagihan',
                    required: true,
                    type: 'editor',
                    value: '',
                },
                {
                    id: 'template_pesan_lunas',
                    label: 'Pesan Whatsapp Lunas',
                    required: true,
                    type: 'editor',
                    value: '',
                },
                {
                    id: 'template_editor_invoice',
                    label: 'Editor Tagihan Invoice',
                    required: true,
                    type: 'editor',
                    value: '',
                },
                {
                    id: 'template_editor_pos',
                    label: 'Format Print POS',
                    required: true,
                    type: 'editor',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2 grid-cols-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getById();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getById() {
        this._templatEditorService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this.FormState = result.data ? 'update' : 'insert';
                    this.FormComps.FormGroup.patchValue(result.data);
                }
            });
    }

    handleClickButtonNavigation(data: LayoutModel.IButtonNavigation) {
        if (data.id == 'save') {
            if (this.FormState == 'update') {
                this.onUpdateData(this.FormComps.FormGroup.value);
            } else {
                let payload = this.FormComps.FormGroup.value;
                delete payload.id_template_editor;
                this.onSaveData(payload);
            }
        };
    }

    private onSaveData(data: any) {
        this._templatEditorService
            .create(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data saved succesfully' });
                    this.getById();
                }
            })
    }

    private onUpdateData(data: any) {
        this._templatEditorService
            .update(data)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Success!', detail: 'Data updated succesfully' });
                    this.getById();
                }
            })
    }
}
