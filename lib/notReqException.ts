export class NotReqException extends Error {
    constructor() {
        super("Request blocked by NOT_REQ");
    }
}
