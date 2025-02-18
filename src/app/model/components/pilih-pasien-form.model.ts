import { FormModel } from "./form.model";

export namespace PilihPasienFormModel {
    export interface IForm {
        id: string;
        state: 'list' | 'form';
        dynamic_form?: FormModel.IForm;
    }
}