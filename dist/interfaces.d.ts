export interface Doc {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface Options {
    timestamps?: boolean;
    id?: boolean;
}
export interface Prop {
    enum?: string[];
    type?: string;
    unique?: boolean;
    required?: boolean;
    default?: any;
}
export interface Schema {
    [key: string]: Prop;
}
