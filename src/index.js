import { useState } from 'react'

// TODO: Enum, minlength, maxlength, match, ref

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
  const [value] = useState(window.localStorage.getItem(storeName))
  const [parsedValue, setParsedValue] = useState(value ? JSON.parse(value) : [])

  if (!value) {
    window.localStorage.setItem(storeName, '[]')
  }

  const filterPropsAndCheckTypes = (newValue) => {
    const filtered = {}
    let error
    Object.keys(schema).forEach((prop) => {
      if (!newValue[prop] && schema[prop].required === true) {
        error = new Error(`${storeName}: "${prop}" is required`)
        return { error }
      }
      if (newValue[prop].constructor.name !== schema[prop].type) {
        error = Error(
          `${storeName}: type of "${prop}" must be ${schema[prop].type}`
        )
        return { error }
      } else if (!newValue[prop] && schema[prop].default) {
        filtered[prop] = schema[prop].default
      } else {
        filtered[prop] = newValue[prop]
      }
    })
    return { error, filtered }
  }

  const setLS = (newValue) => {
    setParsedValue(newValue)
    window.localStorage.setItem(storeName, JSON.stringify(newValue))
  }

  const genId = () =>
    (Math.random() * Math.random()).toString().replace('.', '')

  const genUniqueId = () => {
    const ids = parsedValue.map((i) => i._id)
    let _id = genId()
    while (ids.includes(_id)) {
      _id = genId()
    }
    return _id
  }

  const create = (newValue) =>
    new Promise((res, rej) => {
      const { filtered, error } = filterPropsAndCheckTypes(newValue)
      if (!error) {
        const _id = genUniqueId()
        setLS([...parsedValue, { ...filtered, _id }])
        return res({ ...filtered, _id })
      } else {
        return rej(error)
      }
    })

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
      const doc = parsedValue.find((v) => v._id === _id)
      const updated = cb(doc)
      const { error, filtered } = filterPropsAndCheckTypes(updated)
      if (error) return rej(error)
      setLS(parsedValue.map((v) => (v._id !== _id ? v : { ...filtered, _id })))
      return res({ ...filtered, _id })
    })
  }

  /**
   * Deletes a single document
   * @param {string} _id - _id of the document to be deleted.
   */
  const findByIdAndDelete = (_id) => {
    return new Promise((res, _rej) => {
      setLS(parsedValue.filter((v) => v._id !== _id))
      return res('deleted')
    })
  }

  return {
    value: parsedValue,
    create,
    setDangerously: setLS,
    findByIdAndUpdate,
    findByIdAndDelete,
  }
}

export default useLocalMongo
