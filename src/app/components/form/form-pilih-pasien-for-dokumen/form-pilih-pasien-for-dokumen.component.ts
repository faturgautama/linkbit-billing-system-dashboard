import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { PilihPasienFormModel } from 'src/app/model/components/pilih-pasien-form.model';
import { DropdownModule } from 'primeng/dropdown';
import { Store } from '@ngxs/store';
import { PasienService } from 'src/app/services/pasien/pasien.service';
import { PasienModel } from 'src/app/model/pages/pasien/pasien.model';
import { RekamMedisModel } from 'src/app/model/pages/rekam-medis/rekam-medis.model';
import { RekamMedisActions } from 'src/app/store/rekam-medis';
import { FormModel } from 'src/app/model/components/form.model';

@Component({
    selector: 'app-form-pilih-pasien-for-dokumen',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DynamicFormComponent,
        InputTextModule,
        ButtonModule,
        DropdownModule,
    ],
    templateUrl: './form-pilih-pasien-for-dokumen.component.html',
    styleUrl: './form-pilih-pasien-for-dokumen.component.scss'
})
export class FormPilihPasienForDokumenComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    @Input('props') props: PilihPasienFormModel.IForm;

    FilterSearchPasien$ = new BehaviorSubject<any>(null);

    PasienDatasource: PasienModel.IPasien[] = [];

    RiwayatKunjunganDatasource: RekamMedisModel.IRekamMedis[] = [];

    @Output('onSelectRiwayatKunjungan') onSelectRiwayatKunjungan = new EventEmitter<RekamMedisModel.IRekamMedis>();

    @ViewChild('DynamicFormComps') DynamicFormComps!: DynamicFormComponent;

    ShowForm = false;

    FormValue = new BehaviorSubject<any>(null);

    constructor(
        private _store: Store,
        private _pasienService: PasienService,
    ) {
        this.props = {
            id: '',
            state: 'list'
        };

        this.FilterSearchPasien$
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                if (result) {
                    this.getPasien(result);
                }
            });
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    handleFilterPasienDropdown(args: any) {
        this.FilterSearchPasien$.next(args.filter);
    }

    private getPasien(search: string) {
        let payload = [];

        if (search) {
            payload.push({
                "columnName": "pasien.nama_lengkap",
                "filter": "like",
                "searchText": search,
                "searchText2": "",
                "withOr": true
            });
        }

        this._pasienService
            .getAll(payload)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.PasienDatasource = result.data;
            })
    }

    handleListenFormChanges() {
        this.DynamicFormComps
            .FormGroup
            .valueChanges
            .pipe(
                takeUntil(this.Destroy$),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((result) => {
                this.FormValue.next(result);
            })
    }

    handleChangePasienDropdown(args: any) {
        let payload: any[] = [
            {
                "columnName": 'pasien.no_rekam_medis',
                "filter": "equal",
                "searchText": args.value,
                "searchText2": "",
                "withOr": false
            }
        ];

        this._store
            .dispatch(new RekamMedisActions.GetAllRekamMedis(payload))
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                this.ShowForm = false;
                this.RiwayatKunjunganDatasource = result.rekam_medis.entities;
            })
    }

    handleSelectRiwayatKunjungan(data: RekamMedisModel.IRekamMedis) {
        if (this.props.dynamic_form) {
            this.ShowForm = true;
            this.onSelectRiwayatKunjungan.emit(data);

            this._pasienService
                .getById(data.id_pasien)
                .pipe(takeUntil(this.Destroy$))
                .subscribe((result) => {
                    if (result.responseResult) {
                        this.handleListenFormChanges();
                        this.DynamicFormComps.FormGroup.patchValue(data);
                        this.DynamicFormComps.FormGroup.patchValue(result.data);
                    }
                });

        } else {
            this.onSelectRiwayatKunjungan.emit(data);
        }
    }
}
