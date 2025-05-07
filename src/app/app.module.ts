import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ToastModule } from 'primeng/toast';
import { StateModule } from './store/store.module';
import { QuillModule } from 'ngx-quill'

import { AppComponent } from './app.component';
import { LoadingDialogComponent } from './components/dialog/loading-dialog/loading-dialog.component';

import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from './middleware/jwt.interceptor';
import { TitleCasePipe } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import Quill from 'quill';
import { htmlEditButton } from 'quill-html-edit-button';

Quill.register('modules/htmlEditButton', htmlEditButton);

const config: SocketIoConfig = {
    url: 'https://api.unioniptv.id',
    options: {}
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        ToastModule,
        LoadingDialogComponent,
        StateModule,
        SocketIoModule.forRoot(config),
        QuillModule.forRoot({
            modules: {
                syntax: true,
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    ['blockquote', 'code-block'],

                    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                    [{ 'direction': 'rtl' }],                         // text direction
                    ['table'], // This enables table button
                    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    [{ 'font': [] }],
                    [{ 'align': [] }],

                    ['clean'],                                         // remove formatting button

                    ['link', 'image', 'video'],                        // link and image, video,
                    ['htmlEditButton']
                ],
                table: true,
                htmlEditButton: {
                    debug: true,
                    msg: 'Edit the HTML below',
                },
            }
        })
    ],
    providers: [
        MessageService,
        ConfirmationService,
        CookieService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        TitleCasePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
