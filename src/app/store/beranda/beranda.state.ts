import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { BerandaActions } from "./beranda.action";
import { BerandaService } from "src/app/services/beranda/beranda.service";
import { BerandaModel } from "src/app/model/pages/beranda/beranda.model";

interface BerandaStateModel {
    entities: BerandaModel.IBeranda | null | any;
    success?: boolean;
}

@State<BerandaStateModel>({
    name: 'beranda',
    defaults: {
        entities: null,
        success: true
    }
})
@Injectable()
export class BerandaState {

    constructor(
        private _berandaService: BerandaService,
    ) { }

    @Selector()
    static berandaDashboardEntities(state: BerandaStateModel) {
        return state.entities;
    }

    @Action(BerandaActions.GetAll)
    getAll(ctx: StateContext<BerandaStateModel>) {
        return this._berandaService
            .getAll()
            .pipe(
                tap((result) => {
                    const state = ctx.getState();
                    ctx.setState({
                        ...state,
                        entities: result.data,
                    });
                })
            )
    }


}