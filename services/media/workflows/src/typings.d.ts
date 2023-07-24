/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'ObjectSchemaDefinition' {
  export type ObjectSchemaDefinition<T extends Record<string, any> | null> = {
    // TODO: Adding 'any' here since there are a couple of open issues regarding generics in the latest version of yup.
    // https://github.com/jquense/yup/issues/1159
    // https://github.com/jquense/yup/issues/1247
    // Consider revisiting once 'yup' has addressed these issues.
    [field in keyof T]: any;
  };
}

declare module '*.svg' {
  const content: any;
  export default content;
}
