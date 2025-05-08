import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemplateEditorModel } from 'src/app/model/pages/setup-data/template-editor.model';
import { environment } from 'src/environments/environment';
import { HttpRequestService } from '../http/http-request.service';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';

@Injectable({
    providedIn: 'root'
})
export class TemplateEditorService {

    constructor(
        private _httpRequestService: HttpRequestService
    ) { }

    getAll(): Observable<TemplateEditorModel.GetAllTemplateEditor> {
        return this._httpRequestService.getRequest(`${environment.webApiUrl}/template-editor`);
    }

    create(payload: TemplateEditorModel.CreateTemplateEditor): Observable<HttpBaseResponse> {
        return this._httpRequestService.postRequest(`${environment.webApiUrl}/template-editor`, payload);
    }

    update(payload: TemplateEditorModel.UpdateTemplateEditor): Observable<HttpBaseResponse> {
        return this._httpRequestService.putRequest(`${environment.webApiUrl}/template-editor`, payload);
    }
}
