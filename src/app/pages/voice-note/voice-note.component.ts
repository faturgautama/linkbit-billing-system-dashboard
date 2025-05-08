import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { VoiceNoteService } from 'src/app/services/utility/voice-note.service';

@Component({
    selector: 'app-voice-note',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        CommonModule,
        InputTextModule,
        InputTextareaModule,
        ReactiveFormsModule,
    ],
    templateUrl: './voice-note.component.html',
    styleUrl: './voice-note.component.scss'
})
export class VoiceNoteComponent implements OnInit, OnDestroy {

    VoiceNotesDatasource: any[] = [];

    Form: FormGroup;

    FormState: 'insert' | 'list' = 'list';

    isRecording = false;
    audioBase64: string | null = null;

    constructor(
        private _formBuilder: FormBuilder,
        private _utilityService: UtilityService,
        private _messageService: MessageService,
        private _recorderService: VoiceNoteService,
    ) {
        this.Form = this._formBuilder.group({
            id: [this.VoiceNotesDatasource.length + 1, []],
            nama_siswa: ['', [Validators.required]],
            voice_notes: ['', [Validators.required]],
            keterangan: ['', []],
            create_at: [new Date(), []]
        })
    }

    ngOnInit(): void {
        this.getAll();
    }

    ngOnDestroy(): void {

    }

    private getAll() {
        this.VoiceNotesDatasource = localStorage.getItem("_VN_TEST_") ? JSON.parse(localStorage.getItem("_VN_TEST_") as any) : [];
    }

    startRecording() {
        this.isRecording = true;
        this._recorderService.startRecording();
    }

    async stopRecording() {
        this.isRecording = false;
        this.audioBase64 = await this._recorderService.stopRecording();
        this.Form.get('voice_notes')?.setValue(this.audioBase64);
    }

    handleBackToList() {
        this.Form.reset();
        this.Form = this._formBuilder.group({
            id: [this.VoiceNotesDatasource.length + 1, []],
            nama_siswa: ['', [Validators.required]],
            voice_notes: ['', [Validators.required]],
            keterangan: ['', []],
            create_at: [new Date(), []]
        });
        this.audioBase64 = null;
        this.FormState = 'list';
        this.getAll();
    }

    handleSave() {
        this._utilityService.ShowLoading$.next(true);

        this.VoiceNotesDatasource.push(this.Form.value);
        localStorage.setItem("_VN_TEST_", JSON.stringify(this.VoiceNotesDatasource));

        setTimeout(() => {
            this._messageService.clear();
            this._messageService.add({ severity: 'success', summary: 'Berhasil!', detail: 'Data berhasil disimpan' });
            this.handleBackToList();
            this._utilityService.ShowLoading$.next(false);
        }, 2500);
    }
}
