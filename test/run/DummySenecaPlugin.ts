import { DummyMicroservice} from './DummyMicroservice';
import { SenecaPlugin } from '../../src/run/SenecaPlugin';

export class DummySenecaPlugin extends SenecaPlugin {
    constructor() {
        super('dummy', new DummyMicroservice());
    }
}