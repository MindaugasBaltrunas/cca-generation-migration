export class ConfigNotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigNotFoundException';
    }
}