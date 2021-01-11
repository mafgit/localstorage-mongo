
# localstorage-mongo

> A React Library for interacting with LocalStorage using functions and methods like those provided by Mongoose.

[![NPM](https://img.shields.io/npm/v/localstorage-mongo.svg)](https://www.npmjs.com/package/localstorage-mongo)
[![NPM](https://img.shields.io/npm/dt/localstorage-mongo)]()
[![NPM License](https://img.shields.io/npm/l/all-contributors.svg?style=flat)](https://github.com/tterb/hyde/blob/master/LICENSE)

## What's New in `v1.1.0` ?
- `Model.value` has changed to `Model.docs`
- Now you can make schema-less models as well.
- added `unique` validation option to schemas
- added `enum` validation option to schemas

## Installation

```bash
npm install --save localstorage-mongo
```

Then import it in your react file like:
```js
import useLocalMongo from 'localstorage-mongo'
```

## Creating a model using `useLocalMongo(storeName: string, schema = {})`

```js
const User = useLocalMongo('users', {
  name: { type: 'String', required: true },
  age:  { type: 'Number', default: 18 },
  tags: { type: 'Array', default: [] },
})
```

In this example, we are creating a model for a user. We have created three properties, name, age and tags, and their types must be in quotes, unlike in mongoose. We can make a property required, or set a default value for it.

## Accessing the store by `Model.docs`
```js
User.docs // [{...}, {...}]
```

## Creating a new document using `Model.create(document)`
```js
User.create({ name: 'maf' })
.then(user => console.log(user))
.catch(err => console.error(err))
```

## Updating a document using `Model.findByIdAndUpdate(_id: string)`
```js
const _id = '05533684729679925'
User.findByIdAndUpdate(_id, (user) => {
  return {
    ...user,
    name: 'Abdullah'
  }
})
.then(user => console.log(user))
.catch(err => console.log(err))
```
You can access the document in the callback function, and return the updated document in the callback.

## Deleting a document using `Model.findByIdAndDelete(_id: string)`
```js
User.findByIdAndDelete(_id)
.then(() => console.log('Deleted'))
.catch(err => console.log('Could not delete the document'))
```

## Setting dangerously using `Model.setDangerously`
```js
User.setDangerously("users' array got set to this string now")
```

## License

MIT © [mafgit](https://github.com/mafgit)
