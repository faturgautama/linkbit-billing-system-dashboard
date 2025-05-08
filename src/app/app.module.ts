import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ToastModule } from 'primeng/toast';
import { StateModule } from './store/store.module';

import { AppComponent } from './app.component';
import { LoadingDialogComponent } from './components/dialog/loading-dialog/loading-dialog.component';

import { ConfirmationService, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { JwtInterceptor } from './middleware/jwt.interceptor';
import { TitleCasePipe } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

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
