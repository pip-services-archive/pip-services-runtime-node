import { DynamicMap } from '../../src/portability/DynamicMap';
import { Category } from '../../src/config/Category';
import { ComponentDescriptor } from '../../src/config/ComponentDescriptor';
import { ComponentSet } from '../../src/ComponentSet';
import { FilterParams } from '../../src/data/FilterParams';
import { PagingParams } from '../../src/data/PagingParams';
import { DummyMicroservice } from '../run/DummyMicroservice';
import { IDummyBusinessLogic } from '../logic/IDummyBusinessLogic';
import { LambdaFunction } from '../../src/run/LambdaFunction';

export class DummyLambdaFunction extends LambdaFunction {
    private _logic: IDummyBusinessLogic;

    constructor() {
        super(new DummyMicroservice());
    }

    public link(context: DynamicMap, components: ComponentSet) {
		this._logic = <IDummyBusinessLogic>components.getOneOptional(
			new ComponentDescriptor(Category.BusinessLogic, "pip-services-dummies", "*", "*")
		);

        super.link(context, components);        

        this.registerCommands(this._logic.getCommands());
    }
    
    // private getDummies(params: any, callback: any): void {
    //     this._logic.getDummies(
    //         params.correlation_id,
    //         new FilterParams(params.filter),
    //         new PagingParams(params.paging),
    //         callback  
    //     );
    // }

    // private getDummyById(params: any, callback: any): void {
    //     this._logic.getDummyById(
    //         params.correlation_id,
    //         params.dummy_id,
    //         callback  
    //     );
    // }

    // private createDummy(params: any, callback: any): void {
    //     this._logic.createDummy(
    //         params.correlation_id,
    //         params.dummy,
    //         callback  
    //     );
    // }

    // private updateDummy(params: any, callback: any): void {
    //     this._logic.updateDummy(
    //         params.correlation_id,
    //         params.dummy_id,
    //         params.dummy,
    //         callback  
    //     );
    // }

    // private deleteDummy(params: any, callback: any): void {
    //     this._logic.deleteDummy(
    //         params.correlation_id,
    //         params.dummy_id,
    //         callback  
    //     );
    // }
    
    // protected register() {
    //     this.registerAction(
    //         'get_dummies',
    //         this.getDummies
    //     );

    //     this.registerAction(
    //         'get_dummy_by_id',
    //         this.getDummyById
    //     );

    //     this.registerAction(
    //         'create_dummy',
    //         this.createDummy
    //     );

    //     this.registerAction(
    //         'update_dummy',
    //         this.updateDummy
    //     );

    //     this.registerAction(
    //         'delete_dummy',
    //         this.deleteDummy
    //     );
    // }
}