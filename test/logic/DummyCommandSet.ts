import { DynamicMap } from '../../src/portability/DynamicMap';
import { CommandSet } from '../../src/commands/CommandSet';
import { ICommand } from '../../src/commands/ICommand';
import { Command } from '../../src/commands/Command';
import { Schema } from '../../src/validation/Schema';
import { FilterParams } from '../../src/data/FilterParams';
import { PagingParams } from '../../src/data/PagingParams';
import { IDummyBusinessLogic } from './IDummyBusinessLogic';

export class DummyCommandSet extends CommandSet {
    private _logic: IDummyBusinessLogic;

    constructor(logic: IDummyBusinessLogic) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetDummiesCommand());
		this.addCommand(this.makeGetDummyByIdCommand());
		this.addCommand(this.makeCreateDummyCommand());
		this.addCommand(this.makeUpdateDummyCommand());
		this.addCommand(this.makeDeleteDummyCommand());
    }

	private makeGetDummiesCommand(): ICommand {
		return new Command(
			this._logic,
			"get_dummies",
			new Schema()
				.withOptionalProperty("filter", "FilterParams")
				.withOptionalProperty("paging", "PagingParams")
			,
            (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getDummies(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetDummyByIdCommand(): ICommand {
		return new Command(
			this._logic,
			"get_dummy_by_id",
			new Schema()
				.withProperty("dummy_id", "string"),
            (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => {
                let dummyId = args.getNullableString("dummy_id");
                this._logic.getDummyById(correlationId, dummyId, callback);
            }
		);
	}

	private makeCreateDummyCommand(): ICommand {
		return new Command(
			this._logic,
			"create_dummy",
			new Schema()
				.withProperty("dummy", "Dummy"),
            (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => {
                let dummy = args.get("dummy");
                this._logic.createDummy(correlationId, dummy, callback);
            }
		);
	}

	private makeUpdateDummyCommand(): ICommand {
		return new Command(
			this._logic,
			"update_dummy",
			new Schema()
				.withProperty("dummy_id", "string")
				.withProperty("dummy", "any"),
            (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => {
                let dummyId = args.getNullableString("dummy_id");
                let dummy = args.get("dummy");
                this._logic.updateDummy(correlationId, dummyId, dummy, callback);
            }
		);
	}
	
	private makeDeleteDummyCommand(): ICommand {
		return new Command(
			this._logic,
			"delete_dummy",
			new Schema()
				.withProperty("dummy_id", "string"),
            (correlationId: string, args: DynamicMap, callback: (err: any, result: any) => void) => {
                let dummyId = args.getNullableString("dummy_id");
                this._logic.deleteDummy(correlationId, dummyId, callback);
			}
		);
	}

}