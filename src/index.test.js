/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-unused-vars
import rewire from "rewire";
import {
  mapValueResponse,
  mapArrayResponse,
  mapArrayToValueResponse,
  mapArrayToArrayResponse,
  // eslint-disable-next-line import/named
  __RewireAPI__ as Internal
} from ".";

describe("#mapValueResponse", () => {
  let keys;
  let field;
  let values;

  beforeEach(() => {
    keys = [1, 2];
    field = "id";
    values = [
      { id: 1, value: "Chuck" },
      { id: 2, value: "Norris" },
      { id: null, value: "James Bond" }
    ];
  });

  it("aligns the correct value to the key", () => {
    const expectedResponse = [
      { id: 1, value: "Chuck" },
      { id: 2, value: "Norris" }
    ];

    expect(mapValueResponse(keys, field, values)).toEqual(expectedResponse);
  });

  it("works on any key", () => {
    keys = ["Norris", "Chuck"];
    field = "value";

    const expectedResponse = [
      { id: 2, value: "Norris" },
      { id: 1, value: "Chuck" }
    ];

    expect(mapValueResponse(keys, field, values)).toEqual(expectedResponse);
  });

  it("works on nested keys", () => {
    keys = ["Norris", "Chuck"];
    field = "value.name";
    values = [
      { id: 1, value: { name: "Chuck" } },
      { id: 2, value: { name: "Norris" } }
    ];

    const expectedResponse = [
      { id: 2, value: { name: "Norris" } },
      { id: 1, value: { name: "Chuck" } }
    ];

    expect(mapValueResponse(keys, field, values)).toEqual(expectedResponse);
  });

  it("adds null when a key is not found", () => {
    keys = [2, 1, null, 3];

    const expectedResponse = [
      { id: 2, value: "Norris" },
      { id: 1, value: "Chuck" },
      { id: null, value: "James Bond" },
      null
    ];

    expect(mapValueResponse(keys, field, values)).toEqual(expectedResponse);
  });

  it("adds custom value when a key is not found and custom value is specified", () => {
    keys = [2, 1, 3];

    const expectedResponse = [
      { id: 2, value: "Norris" },
      { id: 1, value: "Chuck" },
      false
    ];

    expect(
      mapValueResponse(keys, field, values, { emptyValue: false })
    ).toEqual(expectedResponse);
  });
});

describe("#mapArrayResponse", () => {
  let keys;
  let field;
  let values;

  beforeEach(() => {
    keys = [1, 2, 3];
    field = "externalId";
    values = [
      { externalId: 1, value: "Chuck" },
      { externalId: 2, value: "Norris" },
      { externalId: 3, value: "Bruce" },
      { externalId: 3, value: "Lee" },
      { externalId: null, value: "James Bond" }
    ];
  });

  it("aligns the correct value to the key", () => {
    const expectedResponse = [
      [{ externalId: 1, value: "Chuck" }],
      [{ externalId: 2, value: "Norris" }],
      [{ externalId: 3, value: "Bruce" }, { externalId: 3, value: "Lee" }]
    ];

    expect(mapArrayResponse(keys, field, values)).toEqual(expectedResponse);
  });

  it("works on any key", () => {
    keys = ["Chuck", "Norris"];
    field = "value";

    const expectedResponse = [
      [{ externalId: 1, value: "Chuck" }],
      [{ externalId: 2, value: "Norris" }]
    ];

    expect(mapArrayResponse(keys, field, values)).toEqual(expectedResponse);
  });

  it("works on nested keys", () => {
    keys = ["Chuck", "Norris"];
    field = "value.name";
    values = [
      { id: 1, value: { name: "Norris" } },
      { id: 2, value: { name: "Chuck" } }
    ];

    const expectedResponse = [
      [{ id: 2, value: { name: "Chuck" } }],
      [{ id: 1, value: { name: "Norris" } }]
    ];

    expect(mapArrayResponse(keys, field, values)).toEqual(expectedResponse);
  });

  it("adds [] when a key is not found", () => {
    keys = [1, 2, 4];

    const expectedResponse = [
      [{ externalId: 1, value: "Chuck" }],
      [{ externalId: 2, value: "Norris" }],
      []
    ];

    expect(mapArrayResponse(keys, field, values)).toEqual(expectedResponse);
  });
});

describe("#mapArrayToValueResponse", () => {
  let keys;
  let field;
  let values;

  beforeEach(() => {
    keys = [[1, 2]];
    field = "id";
    values = [
      { id: 1, value: "Chuck" },
      { id: 2, value: "Norris" },
      { id: null, value: "James Bond" }
    ];

    jest.unmock(".");
  });

  it("aligns the correct value to the key", () => {
    const expectedResponse = [
      [{ id: 1, value: "Chuck" }, { id: 2, value: "Norris" }]
    ];

    expect(mapArrayToValueResponse(keys, field, values)).toEqual(
      expectedResponse
    );
  });

  it("works for multiple key arrays", () => {
    keys = [[1, 2], [], [1]];
    const expectedResponse = [
      [{ id: 1, value: "Chuck" }, { id: 2, value: "Norris" }],
      [],
      [{ id: 1, value: "Chuck" }]
    ];

    expect(mapArrayToValueResponse(keys, field, values)).toEqual(
      expectedResponse
    );
  });

  it("calls mapValueResponse for every key array", () => {
    const mock = jest.fn().mockReturnValue([]);
    Internal.__set__("mapValueResponse", mock);

    mapArrayToValueResponse(keys, field, values);
    expect(mock).toHaveBeenCalledWith(keys[0], field, values);
  });
});

describe("#mapArrayToArrayResponse", () => {
  let keys;
  let field;
  let values;

  beforeEach(() => {
    keys = [[1, 2, 3]];
    field = "externalId";
    values = [
      { externalId: 1, value: "Chuck" },
      { externalId: 2, value: "Norris" },
      { externalId: 3, value: "Bruce" },
      { externalId: 3, value: "Lee" },
      { externalId: null, value: "James Bond" }
    ];
  });

  it("aligns the correct value to the key", () => {
    const expectedResponse = [
      [
        [{ externalId: 1, value: "Chuck" }],
        [{ externalId: 2, value: "Norris" }],
        [{ externalId: 3, value: "Bruce" }, { externalId: 3, value: "Lee" }]
      ]
    ];

    expect(mapArrayToArrayResponse(keys, field, values)).toEqual(
      expectedResponse
    );
  });

  it("works for multiple key arrays", () => {
    keys = [[1, 2, 3], [], [1]];
    const expectedResponse = [
      [
        [{ externalId: 1, value: "Chuck" }],
        [{ externalId: 2, value: "Norris" }],
        [{ externalId: 3, value: "Bruce" }, { externalId: 3, value: "Lee" }]
      ],
      [],
      [[{ externalId: 1, value: "Chuck" }]]
    ];

    expect(mapArrayToArrayResponse(keys, field, values)).toEqual(
      expectedResponse
    );
  });

  it("calls mapValueResponse for every key array", () => {
    const mock = jest.fn().mockReturnValue([]);
    Internal.__set__("mapArrayResponse", mock);

    mapArrayToArrayResponse(keys, field, values);
    expect(mock).toHaveBeenCalledWith(keys[0], field, values);
  });
});

describe("#mapper", () => {
  let mapper;
  let keys;
  let field;
  let values;

  beforeEach(() => {
    mapper = Internal.__get__("mapper");

    keys = [1, 2];
    field = "id";
    values = [{ id: 1, value: "Chuck" }, { id: 2, value: "Norris" }];
  });

  // Throwing invalid responses
  it("throws an error when keys is not an array", () => {
    const keysOptions = ["bogus", 26, null, undefined, false, {}];

    for (const item of keysOptions) {
      // eslint-disable-next-line no-loop-func
      expect(() => {
        mapper("find", item, field, values);
      }).toThrowError("Keys must be an array");
    }
  });

  it("throws an error when field is not a string", () => {
    const fieldOptions = [[], 26, null, undefined, false, {}];

    for (const item of fieldOptions) {
      // eslint-disable-next-line no-loop-func
      expect(() => {
        mapper("find", keys, item, values);
      }).toThrowError("Field must be a string");
    }
  });
});
