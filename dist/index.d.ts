import { Schema, Options } from './interfaces';
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
declare const useLocalMongo: (storeName: string, schema?: Schema, options?: Options) => {};
export default useLocalMongo;
