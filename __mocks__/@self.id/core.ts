export class Core {
    _ceramic: jest.Mock<any, any>;
    getAccountDID: jest.Mock<any, any>;
    get: jest.Mock<any, any>;
    
    constructor() {
        this._ceramic = jest.fn()

        this.getAccountDID = jest.fn()
        this.get = jest.fn()
    }
}
