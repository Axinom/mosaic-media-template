import jsonSourceMap from 'json-source-map';

export interface IValidationError {
  message: string;
  type: 'JsonSchemaValidation' | 'CustomDataValidation';
  schemaPath?: string;
}

export const transformAjvErrors = <
  TErrorObject extends {
    dataPath: string;
    message?: string;
    schemaPath: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Record<string, any>;
  },
>(
  errors: TErrorObject[] | null | undefined,
  data: string | unknown,
  objectName = 'document',
): IValidationError[] => {
  if (!errors || errors.length === 0) {
    return [];
  }

  const sourceMap =
    typeof data === 'string'
      ? jsonSourceMap.parse(data)
      : jsonSourceMap.stringify(data, null, 2);

  return errors.map((error) => {
    const lineNumber = sourceMap.pointers[error.dataPath].value.line + 1;
    const columnNumber = sourceMap.pointers[error.dataPath].value.column + 1;
    const allowedValues = (error.params?.allowedValues ?? []).join(', ');
    const valuesText = allowedValues.length > 0 ? `: ${allowedValues}` : '';
    return {
      message: `JSON path "${objectName}${error.dataPath}" ${error.message}${valuesText} (line: ${lineNumber}, column: ${columnNumber})`,
      type: 'JsonSchemaValidation',
      schemaPath: error.schemaPath,
    };
  });
};
