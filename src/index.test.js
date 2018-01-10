import rewire from 'rewire'
import { mapValueResponse, mapArrayResponse, __RewireAPI__ as Internal } from './'

describe('#mapValueResponse', () => {
  let keys, field, values

  beforeEach(() => {
    keys = [1, 2]
    field = 'id'
    values = [
      { id: 1, value: 'Chuck' },
      { id: 2, value: 'Norris' },
      { id: null, value: 'James Bond' },
    ]
  })

  it('aligns the correct value to the key', () => {
    const expectedResponse = [
      { id: 1, value: 'Chuck' },
      { id: 2, value: 'Norris' },
    ]

    expect(mapValueResponse(keys, field, values)).toEqual(expectedResponse)
  })

  it('works on any key', () => {
    keys = ['Norris', 'Chuck']
    field = 'value'

    const expectedResponse = [
      { id: 2, value: 'Norris' },
      { id: 1, value: 'Chuck' },
    ]

    expect(mapValueResponse(keys, field, values)).toEqual(expectedResponse)
  })

  it('works on nested keys', () => {
    keys = ['Norris', 'Chuck']
    field = 'value.name'
    values = [
      { id: 1, value: { name: 'Chuck' } },
      { id: 2, value: { name: 'Norris' } },
    ]

    const expectedResponse = [
      { id: 2, value: { name: 'Norris' } },
      { id: 1, value: { name: 'Chuck' } },
    ]

    expect(mapValueResponse(keys, field, values)).toEqual(expectedResponse)
  })

  it('adds null when a key is not found', () => {
    keys = [2, 1, null, 3]

    const expectedResponse = [
      { id: 2, value: 'Norris' },
      { id: 1, value: 'Chuck' },
      { id: null, value: 'James Bond' },
      null,
    ]

    expect(mapValueResponse(keys, field, values)).toEqual(expectedResponse)
  })

  it('adds custom value when a key is not found and custom value is specified', () => {
    keys = [2, 1, 3]

    const expectedResponse = [
      { id: 2, value: 'Norris' },
      { id: 1, value: 'Chuck' },
      false,
    ]

    expect(mapValueResponse(keys, field, values, { emptyValue: false })).toEqual(expectedResponse)
  })
})

describe('#mapArrayResponse', () => {
  let keys, field, values

  beforeEach(() => {
    keys = [1, 2, 3]
    field = 'externalId'
    values = [
      { externalId: 1, value: 'Chuck' },
      { externalId: 2, value: 'Norris' },
      { externalId: 3, value: 'Bruce' },
      { externalId: 3, value: 'Lee' },
      { externalId: null, value: 'James Bond' },
    ]
  })

  it('aligns the correct value to the key', () => {
    const expectedResponse = [
      [{ externalId: 1, value: 'Chuck' }],
      [{ externalId: 2, value: 'Norris' }],
      [
        { externalId: 3, value: 'Bruce' },
        { externalId: 3, value: 'Lee' },
      ],
    ]

    expect(mapArrayResponse(keys, field, values)).toEqual(expectedResponse)
  })

  it('works on any key', () => {
    const keys = ['Chuck', 'Norris']
    const field = 'value'

    const expectedResponse = [
      [{ externalId: 1, value: 'Chuck' }],
      [{ externalId: 2, value: 'Norris' }],
    ]

    expect(mapArrayResponse(keys, field, values)).toEqual(expectedResponse)
  })

  it('works on nested keys', () => {
    const keys = ['Chuck', 'Norris']
    const field = 'value.name'
    const values = [
      { id: 1, value: { name: 'Norris' } },
      { id: 2, value: { name: 'Chuck' } },
    ]

    const expectedResponse = [
      [{ id: 2, value: { name: 'Chuck' } }],
      [{ id: 1, value: { name: 'Norris' } }],
    ]
  })

  it('adds [] when a key is not found', () => {
    const keys = [1, 2, 4]

    const expectedResponse = [
      [{ externalId: 1, value: 'Chuck' }],
      [{ externalId: 2, value: 'Norris' }],
      [],
    ]

    expect(mapArrayResponse(keys, field, values)).toEqual(expectedResponse)
  })
})

describe('#mapper', () => {
  let mapper, keys, field, values

  beforeEach(() => {
    mapper = Internal.__get__('mapper')

    keys = [1, 2]
    field = 'id'
    values = [
      { id: 1, value: 'Chuck' },
      { id: 2, value: 'Norris' },
    ]
  })

  // Throwing invalid responses
  it('throws an error when keys is not an array', () => {
    const keysOptions = ['bogus', 26, null, undefined, false, {}]

    for (let keys of keysOptions) {
      expect(() => {
        mapper('find', keys, field, values)
      }).toThrowError('Keys must be an array')
    }
  })

  it('throws an error when field is not a string', () => {
    const fieldOptions = [[], 26, null, undefined, false, {}]

    for (let field of fieldOptions) {
      expect(() => {
        mapper('find', keys, field, values)
      }).toThrowError('Field must be a string')
    }
  })
})
