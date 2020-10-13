export type JSONObject = {
  _tag: 'object'
  key: string
  value: JSON
}

export type JSONArray = {
  _tag: 'array'
  value: JSON[]
}

export type JSONString = {
  _tag: 'string'
  value: string
}

export type JSONNumber = {
  _tag: 'number'
  value: number
}

export type JSONBoolean = {
  _tag: 'boolean'
  value: boolean
}

export type JSONNull = {
  _tag: 'null'
}

export type JSON = JSONObject | JSONArray
