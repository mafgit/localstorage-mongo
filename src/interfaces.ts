export interface Doc {
  _id?: string
  createdAt?: string
  updatedAt?: string
}

export interface Options {
  timestamps?: boolean
  id?: boolean
}

export interface Prop {
  enum?: string[]
  type?: string
  unique?: boolean
  required?: boolean
  default?: any
  // min?: number
  // max?: number
  // minLength?: number
  // maxLength?: number
  // match?: RegExp
  // ref?: string
}

export interface Schema {
  [key: string]: Prop
}
