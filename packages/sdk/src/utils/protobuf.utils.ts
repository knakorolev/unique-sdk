import { Root, Type, INamespace } from 'protobufjs';

type ConvertEnumToStringArgs = {
  value: string;
  key: string;
  NFTMeta: Type;
  locale: Locale;
};

function convertEnumToString(args: ConvertEnumToStringArgs): string {
  const { value, key, NFTMeta, locale } = args;

  let result = value;
  try {
    const options = NFTMeta?.fields[key]?.resolvedType?.options?.[value];
    const translationObject = JSON.parse(options);

    if (translationObject && translationObject[locale]) {
      result = translationObject[locale];
    }
  } catch (error) {
    console.log(
      'Error parsing schema when trying to convert enum to string: ',
      error,
    );
  }
  return result;
}

type Locale = 'en' | string;

type DeserializeConstDataArgs = {
  buffer: Uint8Array | Buffer;
  schema: INamespace;
  locale?: Locale;
  metaKey?: string;
};

type SerializeConstDataArgs = {
  schema: INamespace;
  payload: Record<string, any>;
};

export function deserializeConstData(args: DeserializeConstDataArgs) {
  const {
    buffer,
    schema,
    locale = 'en',
    metaKey = 'onChainMetaData.NFTMeta',
  } = args;

  const root = Root.fromJSON(schema);
  const NFTMeta = root.lookupType(metaKey);
  // Decode a Uint8Array (browser) or Buffer (node) to a message
  const message = NFTMeta.decode(buffer);
  const originalObject = NFTMeta.toObject(message);
  const parseObject = NFTMeta.toObject(message, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: Array, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true,
  });

  const mappingObject = Object.fromEntries(
    Object.keys(originalObject).map((key) => [key, parseObject[key]]),
  );

  for (const key in mappingObject) {
    if (NFTMeta.fields[key].resolvedType === null) {
      continue;
    }

    if (NFTMeta.fields[key].resolvedType?.constructor.name == 'Enum') {
      if (Array.isArray(mappingObject[key])) {
        const items = mappingObject[key];

        items.forEach((item: any, index: number) => {
          mappingObject[key][index] = convertEnumToString({
            value: mappingObject[key][index],
            key,
            NFTMeta,
            locale,
          });
        });
      } else {
        mappingObject[key] = convertEnumToString({
          value: mappingObject[key],
          key,
          NFTMeta,
          locale,
        });
      }
    }
  }
  return mappingObject;
}

export function serializeConstData({
  payload,
  schema,
}: SerializeConstDataArgs): Uint8Array {
  const root = Root.fromJSON(schema);
  const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');

  const errMsg = NFTMeta.verify(payload);

  if (errMsg) {
    throw Error(errMsg);
  }

  const message = NFTMeta.create(payload);

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  return NFTMeta.encode(message).finish();
}
