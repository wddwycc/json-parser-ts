export type JSONObject = {
  _tag: 'object'
  key: string
  value: JSONValue
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

export type JSONValue =
  | JSONObject
  | JSONArray
  | JSONString
  | JSONNumber
  | JSONBoolean
  | JSONNull
export type JSON = JSONObject | JSONArray
