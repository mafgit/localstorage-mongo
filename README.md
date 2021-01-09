
# localstorage-mongo

> A React Library for interacting with LocalStorage using functions and methods like those provided by Mongoose.
> 
[![NPM](https://img.shields.io/npm/v/localstorage-mongo.svg)](https://www.npmjs.com/package/localstorage-mongo) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

```bash
npm install --save localstorage-mongo
```

## Then import it like:

```js
import useLocalMongo from 'localstorage-mongo'
```

## Creating a model using useLocalMongo(storeName: string, schema: object)

```js
const User = useLocalMongo('users', {
  name: { type: 'String', required: true },
  age:  { type: 'Number', default: 18 },
  tags: { type: 'Array', default: [] },
})
```

In this example, we are creating a model for a user. We have created three properties, name, age and tags, and their types must be in quotes, unlike in mongoose. We can make a property required, or set a default value for it.

## Accessing the store by Model.value
```js
User.value // [{...}, {...}]
```

## Creating a new document
```js
User.create({ name: 'maf' })
.then(user => console.log(user))
.catch(err => console.error(err))
```

## Updating a document
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

## Deleting a document
```js
User.findByIdAndDelete(_id)
.then(() => console.log('Deleted'))
.catch(err => console.log('Could not delete the document'))
```

## License

MIT © [mafgit](https://github.com/mafgit)
