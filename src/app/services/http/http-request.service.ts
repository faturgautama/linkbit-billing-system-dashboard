import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, map } from 'rxjs';
import { HttpBaseResponse } from 'src/app/model/http/http-request.model';
import { UtilityService } from '../utility/utility.service';
import { TitleCasePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class HttpRequestService {

    constructor(
        private _httpClient: HttpClient,
        private _titleCasePipe: TitleCasePipe,
        private _utilityService: UtilityService,
        private _messageService: MessageService,
    ) { }

    /**
     * @description Get Request Method
     * @param url 
     * @param queryString 
     * @returns Observable<HttpBaseResponse>
    */
    getRequest(url: string, queryString?: any): Observable<HttpBaseResponse> {
        this._utilityService.ShowLoading$.next(true);

        return this._httpClient.get<HttpBaseResponse>(url, {
            params: queryString
        }).pipe(
            map((result) => {
                this._utilityService.ShowLoading$.next(false);

                if (!result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'warn', summary: 'Oops', detail: this._titleCasePipe.transform(result.message) })
                }

                return result;
            }),
            catchError((error: any) => {
                this.handlingError(error);
                throw error;
            })
        )
    }

    /**
     * @description Get File Request Method
     * @param url 
     * @param queryString 
     * @returns Observable<HttpBaseResponse>
    */
    getFileRequest(url: string) {
        this._utilityService.ShowLoading$.next(true);

        this._httpClient
            .get(url, { responseType: 'blob' })
            .subscribe((blob) => {
                this._utilityService.ShowLoading$.next(false);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pelanggan_import_template.xlsx'; // <- file name
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
    }

    /**
     * @description Get Request Method
     * @param url 
     * @param queryString 
     * @returns Observable<HttpBaseResponse>
    */
    getRequestWithoutLoading(url: string, queryString?: any): Observable<HttpBaseResponse> {
        return this._httpClient.get<HttpBaseResponse>(url, {
            params: queryString
        }).pipe(
            map((result) => {
                if (!result.status) {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'warn', summary: 'Oops', detail: this._titleCasePipe.transform(result.message) })
                }

                return result;
            }),
            catchError((error: any) => {
                this.handlingError(error);
                throw error;
            })
        )
    }

    /**
     * @description Post Request Method
     * @param url 
     * @param data 
     * @param showSuccessNotif -> (Optional) jika ingin menampilkan notification success
     * @returns Observable<HttpBaseResponse>
    */
    postRequest(url: string, data: any, showSuccessNotif?: boolean, isFormData?: boolean): Observable<HttpBaseResponse> {
        this._utilityService.ShowLoading$.next(true);

        if (!isFormData) {
            for (const item in data) {
                if (item.includes('tanggal') || item.includes('tgl') || item.includes('tangal')) {
                    data[item] = this._utilityService.onFormatDate(data[item], 'yyyy-MM-DD HH:mm:ss')
                }
            };
        }

        return this._httpClient.post<HttpBaseResponse>(url, data)
            .pipe(
                map((result) => {
                    // ** Change state show loading
                    this._utilityService.ShowLoading$.next(false);

                    // ** Show success notification
                    if (result.status && showSuccessNotif) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Success', detail: result.message });
                    }

                    // ** Jika status = false
                    if (!result.status) {
                        this.handlingValidation(result.message)
                    }

                    return result;
                }),
                catchError((error: any) => {
                    this.handlingError(error);
                    throw error;
                })
            )
    }

    /**
     * @description Post Request Method
     * @param url 
     * @param data 
     * @param showSuccessNotif -> (Optional) jika ingin menampilkan notification success
     * @returns Observable<HttpBaseResponse>
    */
    postRequestWithoutLoading(url: string, data: any): Observable<HttpBaseResponse> {
        for (const item in data) {
            if (item.includes('tanggal') || item.includes('tgl') || item.includes('tangal')) {
                data[item] = this._utilityService.onFormatDate(data[item], 'yyyy-MM-DD HH:mm:ss')
            }
        };

        return this._httpClient.post<HttpBaseResponse>(url, data)
            .pipe(
                map((result) => {
                    // ** Jika status = false
                    if (!result.status) {
                        this.handlingValidation(result.message)
                    }

                    return result;
                }),
                catchError((error: any) => {
                    this.handlingError(error);
                    throw error;
                })
            )
    }

    /**
     * @description Post Request Method For External API
     * @param url 
     * @param data 
     * @param showSuccessNotif -> (Optional) jika ingin menampilkan notification success
     * @returns Observable<any>
    */
    postRequestExternal(url: string, data: any, showSuccessNotif?: boolean): Observable<any> {
        this._utilityService.ShowLoading$.next(true);

        return this._httpClient.post<any>(url, data)
            .pipe(
                map((result) => {
                    // ** Change state show loading
                    this._utilityService.ShowLoading$.next(false);

                    // ** Show success notification
                    if (result && showSuccessNotif) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Success', detail: this._titleCasePipe.transform(result.message) });
                    }

                    // ** Jika status = false
                    if (!result.status) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'warn', summary: 'Oops', detail: this._titleCasePipe.transform(result.message) })
                    }

                    return result;
                }),
                catchError((error: any) => {
                    this.handlingError(error);
                    throw error;
                })
            )
    }

    /**
     * @description Put Request Method
     * @param url 
     * @param data 
     * @param showSuccessNotif -> (Optional) jika ingin menampilkan notification success
     * @returns Observable<HttpBaseResponse>
    */
    putRequest(url: string, data: any, showSuccessNotif?: boolean): Observable<HttpBaseResponse> {
        this._utilityService.ShowLoading$.next(true);

        for (const item in data) {
            if (item.includes('tanggal') || item.includes('tgl') || item.includes('tangal')) {
                data[item] = this._utilityService.onFormatDate(data[item], 'yyyy-MM-DD HH:mm:ss')
            }
        };

        return this._httpClient.put<HttpBaseResponse>(url, data)
            .pipe(
                map((result: any) => {
                    // ** Change state show loading
                    this._utilityService.ShowLoading$.next(false);

                    // ** Show success notification
                    if (result.status && showSuccessNotif) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Success', detail: this._titleCasePipe.transform(result.message) });
                    }

                    // ** Jika status = false
                    if (!result.status) {
                        this.handlingValidation(result.message)
                    }

                    return result;
                }),
                catchError((error: any) => {
                    this.handlingError(error);
                    throw error;
                })
            )
    }

    /**
     * @description Delete Request Method
     * @param url 
     * @param data 
     * @param showSuccessNotif -> (Optional) jika ingin menampilkan notification success
     * @returns Observable<HttpBaseResponse>
    */
    deleteRequest(url: string, showSuccessNotif?: boolean): Observable<HttpBaseResponse> {
        this._utilityService.ShowLoading$.next(true);

        return this._httpClient.delete<HttpBaseResponse>(url)
            .pipe(
                map((result) => {
                    // ** Change state show loading
                    this._utilityService.ShowLoading$.next(false);

                    // ** Show success notification
                    if (result.status && showSuccessNotif) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Success', detail: this._titleCasePipe.transform(result.message) });
                    }

                    // ** Jika status = false
                    if (!result.status) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'warn', summary: 'Oops', detail: this._titleCasePipe.transform(result.message) })
                    }

                    return result;
                }),
                catchError((error: any) => {
                    this.handlingError(error);
                    throw error;
                })
            )
    }

    private handlingError(error: HttpErrorResponse): void {
        this._utilityService.ShowLoading$.next(false);
        this._messageService.clear();
        this._messageService.add({ severity: 'error', summary: error.statusText, detail: error.error.message })
    }

    private handlingValidation(message: any) {
        this._messageService.clear();

        if (Array.isArray(message)) {
            message.forEach((msg: string) => {
                this._messageService.add({
                    severity: 'warn',
                    summary: 'Oops',
                    detail: this._titleCasePipe.transform(msg),
                });
            });
        } else {
            this._messageService.add({
                severity: 'warn',
                summary: 'Oops',
                detail: this._titleCasePipe.transform(message),
            });
        }
    }
}
