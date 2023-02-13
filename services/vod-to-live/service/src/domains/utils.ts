import { create } from 'xmlbuilder2';

/**
 * Converts any object to string XML representation.
 * @param expandedObject - object to convert to XML.
 * @returns- string containing XML of the object.
 */
export const convertObjectToXml = (
  expandedObject:
    | {
        [key: string]: any;
      }
    | Map<string, any>
    | any[]
    | Set<any>
    | ((...args: any) => any),
): string => {
  return create({ version: '1.0', encoding: 'UTF-8' }, expandedObject).end({
    prettyPrint: true,
    spaceBeforeSlash: true,
  });
};
