import { Schema, Options, Doc } from './interfaces';
/**
 * Creates a model
 * @param {string} storeName - Store name, such as 'users'
 * @param {Schema} [schema] - Schema for your model
 * ```ts
 * // Example
 * { name: { type: 'String', required: true } }
 * ```
 * @param {Options} [options] - Options
 * ```ts
 * // Example
 * { timestamps: true, id: false }
 * ```
 * @returns Model
 */
declare const useLocalMongo: (storeName: string, schema?: Schema, options?: Options) => {
    docs: Doc[];
    /**
     * Creates a document in the store
     * @param {Doc} Document
     */
    create: (doc: {}) => Promise<any>;
    /**
     * Updates a single document
     * @param {string} _id - _id of the document to be updated.
     * @param {Function} callback - Return the updated version of the document in this function
     * ```ts
     * // Callback example
     * (user) => ({ ...user, name: 'New Name' })
     * ```
     */
    findByIdAndUpdate: (_id: string, cb: (doc: {}) => Doc) => Promise<any>;
    /**
     * Deletes a single document
     * @param {string} _id - _id of the document to be deleted.
     */
    findByIdAndDelete: (_id: string) => Promise<any>;
};
export default useLocalMongo;
