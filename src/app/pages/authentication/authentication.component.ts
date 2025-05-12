import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { FormModel } from 'src/app/model/components/form.model';
import { ButtonModule } from 'primeng/button';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-authentication',
    standalone: true,
    imports: [
        CommonModule,
        DynamicFormComponent,
        ButtonModule,
    ],
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    Version = environment.version;

    Year = new Date().getFullYear();

    constructor(
        private _router: Router,
        private _utilityService: UtilityService,
        private _authenticationService: AuthenticationService,
    ) {
        this.FormProps = {
            id: 'authentication',
            fields: [
                {
                    id: 'username',
                    label: 'Username',
                    required: true,
                    type: 'text',
                    value: '',
                },
                {
                    id: 'password',
                    label: 'Password',
                    required: true,
                    type: 'password',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-2',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        const userData = this._authenticationService.getUserData();

        if (userData) {
            this._router.navigateByUrl("beranda");
        };
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleSignIn() {
        const formValue = this.FormComps.onGetFormValue();

        if (formValue) {
            this._authenticationService
                .signIn(formValue)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.status) {
                        this._authenticationService.setUserData();
                        this._router.navigateByUrl("beranda");
                    }
                })
        }
    }
}
