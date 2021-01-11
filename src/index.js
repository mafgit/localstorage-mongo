import { useState } from 'react'

// TODO: minlength, maxlength, match, ref, min, max

/**
 * Creates a model
 * @param {string} storeName - Store name, such as 'users'
 * @param {Object} schema - Schema for your model
 * - Example:
 * ```js
 * { name: { type: 'String', required: true },
 *    age: { type: 'Number', default: 18 } }
 * ```
 * @returns {Object} Model
 */
const useLocalMongo = (storeName, schema = {}) => {
  if (!storeName) throw new Error('Store Name is required')
  const [value] = useState(window.localStorage.getItem(storeName))
  const [documents, setDocuments] = useState(value ? JSON.parse(value) : [])

  if (!value) {
    window.localStorage.setItem(storeName, '[]')
  }

  const validateEnum = (newValue, prop, storeName) => {
    if (!schema[prop].enum.includes(newValue[prop]))
      return {
        error: `${storeName}: value: "${newValue[prop]}" for property: "${prop}" doesn't pass the enum validation`,
      }
  }
  const validateUniqueness = (newValue, prop, storeName) => {
    if (documents.find((v) => v[prop] === newValue[prop])) {
      return {
        error: `${storeName}: document with value: "${newValue[prop]}" for property "${prop}" already exists, it must be unique`,
      }
    }
  }
  const validateRequired = (newValue, prop, storeName) => {
    if (!newValue[prop]) return { error: `${storeName}: "${prop}" is required` }
  }
  const validateType = (newValue, prop, storeName) => {
    if (newValue[prop].constructor.name !== schema[prop].type)
      return {
        error: `${storeName}: type of "${prop}" must be ${schema[prop].type}`,
      }
  }

  const validate = (newValue) => {
    return new Promise((resolve, reject) => {
      const filtered = {}
      Object.keys(schema).forEach((prop) => {
        // checking "required"
        if (schema[prop].required === true) {
          let error = validateRequired(newValue, prop, storeName)
          if (error) return reject(error)
        }
        // checking "type"
        if (
          ['String', 'Array', 'Boolean', 'Number', 'Object'].includes(
            schema[prop].type
          )
        ) {
          let error = validateType(newValue, prop, storeName)
          if (error) return reject(error)
        }
        // checking "unique"
        if (schema[prop].unique === true) {
          let error = validateUniqueness(newValue, prop, storeName)
          if (error) return reject(error)
        }
        // checking "enum"
        if (Array.isArray(schema[prop].enum)) {
          let error = validateEnum(newValue, prop, storeName)
          if (error) return reject(error)
        }
        if (!newValue[prop] && schema[prop].default) {
          filtered[prop] = schema[prop].default
        } else {
          filtered[prop] = newValue[prop]
        }
      })

      return resolve(filtered)
    })
  }

  const setLS = (newValue) => {
    setDocuments(newValue)
    window.localStorage.setItem(storeName, JSON.stringify(newValue))
  }

  const genId = () =>
    (Math.random() * Math.random()).toString().replace('.', '')

  const genUniqueId = () => {
    const ids = documents.map((i) => i._id)
    let _id = genId()
    while (ids.includes(_id)) {
      _id = genId()
    }
    return _id
  }

  const create = (newValue) => {
    // If no schema:
    if (Object.keys(schema).length === 0) {
      const _id = genUniqueId()
      setLS([...documents, { ...newValue, _id }])
      return new Promise((resolve) => resolve({ ...newValue, _id }))
    }
    // If there is schema:
    return validate(newValue)
      .then((filtered) => {
        const _id = genUniqueId()
        setLS([...documents, { ...filtered, _id }])
        return Promise.resolve({ ...filtered, _id })
      })
      .catch((err) => Promise.reject(err))
  }

  /**
   * Updates a single document
   * @param {string} _id - _id of the document to be updated.
   * @param {Function} function - Return the updated version of the document in this function
   * - Example:
   * ```js
   * (user) => ({ ...user, name: 'New Name' })
   * ```
   */
  const findByIdAndUpdate = (_id, cb) => {
    return new Promise((res, rej) => {
      const doc = documents.find((v) => v._id === _id)
      const updated = cb(doc)
      validate(updated)
        .then((filtered) => {
          setLS(
            documents.map((v) => (v._id !== _id ? v : { ...filtered, _id }))
          )
          return res({ ...filtered, _id })
        })
        .catch((err) => rej(err))
    })
  }

  /**
   * Deletes a single document
   * @param {string} _id - _id of the document to be deleted.
   */
  const findByIdAndDelete = (_id) => {
    return new Promise((res, _rej) => {
      setLS(documents.filter((v) => v._id !== _id))
      return res('deleted')
    })
  }

  return {
    docs: documents,
    create,
    setDangerously: setLS,
    findByIdAndUpdate,
    findByIdAndDelete,
  }
}

export default useLocalMongo
