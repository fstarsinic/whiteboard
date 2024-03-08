type NormalizedResult = { [key: string]: any }[];

function normalizeJson(data: any, parentKey: string = '', result: NormalizedResult = []): NormalizedResult {
  if (Array.isArray(data)) {
    data.forEach((item) => normalizeJson(item, parentKey, result));
  } else if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data);
    const flatObject: { [key: string]: any } = {};

    keys.forEach((key) => {
      if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
        normalizeJson(data[key], parentKey + key + '.', result);
      } else {
        flatObject[parentKey + key] = data[key];
      }
    });

    if (Object.keys(flatObject).length > 0) {
      result.push(flatObject);
    }
  } else {
    result.push({ [parentKey.slice(0, -1)]: data });
  }

  return result;
}

// Usage example
const exampleJson = {
  id: 1,
  name: "John Doe",
  info: {
    age: 30,
    address: {
      city: "New York",
      country: "USA"
    }
  },
  tags: ["developer", "javascript"]
};

console.log(normalizeJson(exampleJson));
