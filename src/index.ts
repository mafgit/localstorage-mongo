import { useState } from 'react'
import { Schema, Options, Doc } from './interfaces'

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
const useLocalMongo = (
  storeName: string,
  schema: Schema = {},
  options: Options = {
    timestamps: false,
    id: true,
  }
) => {
  if (!storeName) throw new Error('Store Name is required')
  if (typeof options.timestamps === 'undefined') options.timestamps = false
  if (typeof options.id === 'undefined') options.id = true

  const [value] = useState(window.localStorage.getItem(storeName))
  const docState = useState(value ? JSON.parse(value) : [])
  const documents: Doc[] = docState[0]
  const setDocuments: Function = docState[1]

  if (!value) {
    window.localStorage.setItem(storeName, '[]')
  }

  const isSchemaLess = (): boolean => Object.keys(schema).length === 0

  const validateEnum = (doc: Doc, prop: string) => {
    if (!schema[prop].enum!.includes(doc[prop]))
      return `Value: '${doc[prop]}' for property: '${prop}' doesn't pass the enum validation.`
  }
  const validateUniqueness = (doc: Doc, prop: string) => {
    if (documents.find((v: {}) => v[prop] === doc[prop])) {
      return `Document with value: "${doc[prop]}" for property '${prop}' already exists, it must be unique.`
    }
  }
  const validateRequired = (doc: Doc, prop: string) => {
    if (!doc[prop]) return `'${prop}' is required.`
  }
  const validateType = (doc: Doc, prop: string) => {
    if (doc[prop].constructor.name !== schema[prop].type)
      return `Type of '${prop}' must be '${schema[prop].type}', '${doc[prop].constructor.name}' provided.`
  }

  const validate = (doc: Doc) =>
    new Promise((resolve, reject) => {
      const filtered: Doc = {}
      Object.keys(schema).forEach((prop) => {
        // checking "required"
        if (schema[prop].required === true) {
          let error = validateRequired(doc, prop)

          if (error) return reject(error)
        }
        // checking "type"
        if (
          ['String', 'Array', 'Boolean', 'Number', 'Object', 'BigInt'].includes(
            schema[prop].type
          ) &&
          doc[prop]
        ) {
          let error = validateType(doc, prop)
          if (error) return reject(error)
        }
        // checking "unique"
        if (schema[prop].unique === true) {
          let error = validateUniqueness(doc, prop)
          if (error) return reject(error)
        }
        // checking "enum"
        if (Array.isArray(schema[prop].enum)) {
          let error = validateEnum(doc, prop)
          if (error) return reject(error)
        }
        if (!doc[prop] && typeof schema[prop].default !== 'undefined') {
          filtered[prop] = schema[prop].default
        } else if (doc[prop]) {
          filtered[prop] = doc[prop]
        }
      })

      const checkIfAnyProp = Object.keys(filtered).filter(
        (i) => !i.match(/^[createdAt|updatedAt|_id]$/)
      )

      if (checkIfAnyProp.length === 0)
        return reject('No field that is mentioned in the schema is provided.')
      return resolve(filtered)
    })

  const setLS = (newDocs: Doc[]) => {
    setDocuments(newDocs)
    window.localStorage.setItem(storeName, JSON.stringify(newDocs))
  }

  const genId = () => {
    const choices: string = 'abcdef0123456789'
    let _id: string = ''
    for (let i = 0; i < 24; i++) {
      _id += choices[Math.floor(Math.random() * 16)]
    }
    return _id
  }

  const genUniqueId = () => {
    const ids: string[] = documents.map((i: Doc) => i._id)
    let _id: string = genId()
    while (ids.includes(_id)) {
      _id = genId()
    }
    return _id
  }

  const create = (doc: {}): Promise<any> => {
    if (!doc)
      return Promise.reject(
        `\nStore: '${storeName}'\nDocument not provided to the create function.`
      )
    if (Object.keys(doc).length === 0)
      return Promise.reject(
        `\nStore: '${storeName}'\nDocument provided to the function is empty.`
      )
    // If no schema:
    if (isSchemaLess()) {
      return new Promise((resolve) => {
        const newDoc: Doc = { ...doc }
        if (options.id === true) {
          newDoc._id = genUniqueId()
        }
        if (options.timestamps === true) {
          newDoc.createdAt = new Date().toISOString()
        }
        setLS([...documents, newDoc])
        return resolve(newDoc)
      })
    }
    // If there is schema:
    return validate(doc)
      .then((filtered: Doc) => {
        const newDoc: Doc = { ...filtered }
        if (options.id === true) {
          newDoc._id = genUniqueId()
        }
        if (options.timestamps === true) {
          newDoc.createdAt = new Date().toISOString()
        }
        setLS([...documents, newDoc])
        return Promise.resolve(newDoc)
      })
      .catch((err) => Promise.reject(`\nStore: '${storeName}'\n${err}`))
  }

  const findByIdAndUpdate = (
    _id: string,
    cb: (doc: {}) => Doc
  ): Promise<any> => {
    if (!_id.match(/^[a-z|0-9]{24}$/))
      return Promise.reject('Invalid document _id')

    const updateToLS = (oldDoc: Doc, newDoc: Doc) => {
      if (options.timestamps === true) {
        newDoc.updatedAt = new Date().toISOString()
        newDoc.createdAt = oldDoc.createdAt
      }
      newDoc._id = oldDoc._id
      setLS(documents.map((v: Doc) => (v._id !== _id ? v : newDoc)))
      return newDoc
    }

    const oldDoc: Doc = documents.find((v: Doc) => v._id === _id)
    const updated: Doc = cb(oldDoc)
    if (isSchemaLess()) {
      const filtered = updateToLS(oldDoc, updated)
      return Promise.resolve(filtered)
    }
    return validate(updated)
      .then((filtered: Doc) => {
        const newDoc = { ...filtered, _id }
        updateToLS(oldDoc, newDoc)
        return Promise.resolve(newDoc)
      })
      .catch((err) => Promise.reject(`\nStore: '${storeName}'\n${err}`))
  }

  const findByIdAndDelete = (_id: string): Promise<any> => {
    return new Promise((res, rej) => {
      if (!_id.match(/^[a-z|0-9]{24}$/)) return rej('Invalid document _id')
      setLS(documents.filter((v: Doc) => v._id !== _id))
      return res('deleted')
    })
  }

  return {
    docs: documents,

    /**
     * Creates a document in the store
     * @param {Doc} Document
     */
    create,

    /**
     * Updates a single document
     * @param {string} _id - _id of the document to be updated.
     * @param {Function} callback - Return the updated version of the document in this function
     * ```ts
     * // Callback example
     * (user) => ({ ...user, name: 'New Name' })
     * ```
     */
    findByIdAndUpdate,

    /**
     * Deletes a single document
     * @param {string} _id - _id of the document to be deleted.
     */
    findByIdAndDelete,
  }
}

export default useLocalMongo
