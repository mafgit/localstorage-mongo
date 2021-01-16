<div align="center">
<img src="https://repository-images.githubusercontent.com/328192305/6a9dcf80-540c-11eb-9531-d9a1ad35bc79" width="500"/>

# localstorage-mongo

A React Library to allow you to use LocalStorage like MongoDB.

[![NPM](https://img.shields.io/npm/v/localstorage-mongo.svg)](https://www.npmjs.com/package/localstorage-mongo)
[![NPM](https://img.shields.io/npm/dt/localstorage-mongo)]()
[![NPM License](https://img.shields.io/npm/l/all-contributors.svg?style=flat)](https://github.com/tterb/hyde/blob/master/LICENSE)

</div>

## What's New in `v1.2.0` ?
- Third parameter added to useLocalMongo, `options`,
- You can now control the generation of `timestamps` and `id` of a document.
- Bug fixes
  
## Installation

```bash
npm install --save localstorage-mongo
```

Then import it in your react file like:
```ts
import useLocalMongo from 'localstorage-mongo'
```

## Creating a model
### `useLocalStorage(storeName, [schema], [options]])`
```ts
// Schema-less model
const Book = useLocalStorage('books')

// Providing schema and options
const userSchema = {
  name: { type: 'String', required: true },
  age:  { type: 'Number', default: 18 },
  hobbies: { type: 'Array', default: ['football', 'cricket'] },
}

const userOptions = {
  timestamps: true // allows the creation of createdAt and updatedAt fields.
}

const User = useLocalMongo('users', schema, options)
```

**NOTE**: Types must be provided as a string, unlike in mongoose. 

You can make a property required or set a default value for it. There are a few other validation options:

#### Schema - Validations for properties
- `type`: the type of the property's value, must be provided as a string such as "Boolean"
- `enum`: can be provided for a property with type string, it checks whether the value is in the array provided. Example: `{ status: { enum: ['pending', 'delivered'] } }`
- `unique`: can be provided for a property to ensure that it stays unique through out the store.
- `required`: to ensure that the value must be provided for a property.
- `default`: this is a fallback value for the property that isn't required, and isn't provided.
<!-- TODO: Add More Validations -->

#### Options
- `timestamps` set to `false` as default, is a boolean which must be set to true if you want the createdAt and updatedAt properties.
- `id` is a boolean which must be set to `false` if you don't want to generate ids.

## Accessing the store
### `Model.docs`
```ts
User.docs // [{...}, {...}]
```

## Creating a new document
### `Model.create(document)`
```ts
User.create({ name: 'maf' })
  .then(user => console.log(user))
  .catch(err => console.error(err))
```

## Updating a document
### `Model.findByIdAndUpdate(_id, callback)`
```ts
const _id = 'bca4ed840c2c2bf674eccc3c'
User.findByIdAndUpdate(_id, (user) => {
  return {
    ...user, // don't spread the previous document if you wanna replace instead
    name: 'New Name'
  }
})
  .then(user => console.log(user))
  .catch(err => console.log(err))
```
You can access the document in the callback function, and return the updated document in the callback.

#### Replacing a document
Don't spread the previous document, inside callback, if you want to replace it instead of updating, validations would still apply.


## Deleting a document
### `Model.findByIdAndDelete(_id)`
```ts
User.findByIdAndDelete(_id)
.then(() => console.log('Deleted'))
.catch(err => console.log('Could not delete the document'))
```

## License

MIT © [mafgit](https://github.com/mafgit)
