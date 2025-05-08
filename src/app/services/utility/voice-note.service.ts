import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class VoiceNoteService {

    private mediaRecorder!: MediaRecorder;
    private audioChunks: Blob[] = [];
    private audioBlob!: Blob;

    constructor() { }

    startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start();

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
            };
        });
    }

    stopRecording(): Promise<string> {
        return new Promise((resolve) => {
            this.mediaRecorder.stop();
            this.audioChunks = [];
            this.audioBlob = null as any;

            setTimeout(() => {
                this.convertToBase64(this.audioBlob).then((base64String) => {
                    resolve(base64String);
                });
            }, 500);
        });
    }

    private convertToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject('Failed to convert blob to base64');
                }
            };
            reader.onerror = () => reject(reader.error);
        });
    }
}
