import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { DynamicFormComponent } from 'src/app/components/form/dynamic-form/dynamic-form.component';
import { FormModel } from 'src/app/model/components/form.model';
import { PelangganModel } from 'src/app/model/pages/pelanggan/pelanggan.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { PelangganService } from 'src/app/services/pelanggan/pelanggan.service';
import { ProductService } from 'src/app/services/setup-data/product.service';

@Component({
    selector: 'app-setting-pelanggan-product',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        DynamicFormComponent,
    ],
    templateUrl: './setting-pelanggan-product.component.html',
    styleUrl: './setting-pelanggan-product.component.scss'
})
export class SettingPelangganProductComponent implements OnInit, OnDestroy {

    Destroy$ = new Subject();

    UserData = this._authenticationService.getUserData();

    Pelanggan: PelangganModel.IPelanggan[] = [];

    selectedItems: any[] = [];
    isSelecting = false;

    FormState: 'insert' | 'update' = 'insert';
    FormProps: FormModel.IForm;
    @ViewChild('FormComps') FormComps!: DynamicFormComponent;

    constructor(
        private _productService: ProductService,
        private _pelangganService: PelangganService,
        private _authenticationService: AuthenticationService,
    ) {
        this.FormProps = {
            id: 'form_setup_pelanggan_product',
            fields: [
                {
                    id: 'id_pelanggan',
                    label: 'Id Pelanggan',
                    required: true,
                    type: 'text',
                    value: '',
                    hidden: true,
                },
                {
                    id: 'id_product',
                    label: 'Produk Layanan',
                    required: false,
                    type: 'select',
                    value: '',
                    dropdownProps: {
                        options: [],
                        optionName: 'product_name',
                        optionValue: 'id_product'
                    },
                    onChange: (args) => {
                        if (args) {
                            this.FormComps.FormGroup.get('price')?.setValue(args.price);
                            this.FormComps.FormGroup.get('invoice_cycle')?.setValue(args.invoice_cycle);
                            this.FormComps.FormGroup.get('days_before_send_invoice')?.setValue(args.days_before_send_invoice);
                        }
                    }
                },
                {
                    id: 'start_date',
                    label: 'Tgl. Mulai Berlangganan',
                    required: true,
                    type: 'date',
                    value: '',
                },
                {
                    id: 'price',
                    label: 'Harga',
                    required: true,
                    type: 'number',
                    value: '',
                },

                {
                    id: 'invoice_cycle',
                    label: 'Siklus Tagihan',
                    required: true,
                    type: 'select',
                    dropdownProps: {
                        options: [
                            { name: 'Setiap Bulan', value: 'MONTHLY' },
                            { name: '3 Bulan', value: '3 MONTH' },
                            { name: '6 Bulan', value: '6 MONTH' },
                            { name: 'Tahunan ', value: 'YEARLY' },
                        ],
                        optionName: 'name',
                        optionValue: 'value'
                    },
                    value: '',
                },
                {
                    id: 'days_before_send_invoice',
                    label: 'Penerbitan Invoice Setiap Tanggal',
                    required: true,
                    type: 'number',
                    value: '',
                },
            ],
            style: 'not_inline',
            class: 'grid-rows-5 grid-cols-1',
            state: 'write',
            defaultValue: null,
        };
    }

    ngOnInit(): void {
        this.getAllPelanggan();
        this.getAllProduct();
    }

    ngOnDestroy(): void {
        this.Destroy$.next(0);
        this.Destroy$.complete();
    }

    private getAllPelanggan() {
        this._pelangganService
            .getAllNotHaveProduct(this.UserData.id_setting_company)
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    this.Pelanggan = result.data;
                }
            });
    }

    private getAllProduct() {
        this._productService
            .getAll()
            .pipe(takeUntil(this.Destroy$))
            .subscribe((result) => {
                if (result) {
                    const index = this.FormProps.fields.findIndex(item => item.id == 'id_product');
                    this.FormProps.fields[index].dropdownProps.options = result.data;
                }
            });
    }

    onHoldStart(event: MouseEvent | TouchEvent) {
        event.preventDefault();
        this.isSelecting = true;
    }

    onHoldCancel() {
        this.isSelecting = false;
    }

    onItemHover(item: any) {
        if (this.isSelecting && !this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
        }
    }

    onTouchMove(event: TouchEvent) {
        const touch = event.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        const allItems = document.querySelectorAll('#listCustomerNotHaveProduct > div');
        allItems.forEach((el, index) => {
            if (el.contains(target) && !this.selectedItems.includes(this.Pelanggan[index])) {
                this.selectedItems.push(this.Pelanggan[index]);
            }
        });
    }

    // Klik langsung pada item
    onItemClick(item: any) {
        const index = this.selectedItems.indexOf(item);
        if (index > -1) {
            this.selectedItems.splice(index, 1);
        } else {
            this.selectedItems.push(item);
        }
    }
}
