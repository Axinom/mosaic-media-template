// A simplified fetch implementation based on the comments of
// https://github.com/jaydenseric/apollo-upload-client/issues/88
//
// As an alternative to this we can also use, axios-fetch
// https://github.com/lifeomic/axios-fetch
//

interface CustomFetchOptions extends RequestInit {
  method: string;
  headers: Headers | [string, string][] | Record<string, string>;
  useUpload: boolean;
  onProgress?: (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => void;
  onAbortPossible?: (v: () => void) => void;
  body: XMLHttpRequestBodyInit;
}

const parseHeaders = (rawHeaders: string): Headers => {
  const headers = new Headers();
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach((line: string) => {
    const parts = line.split(':');
    const key = parts.shift();
    if (key) {
      const value = parts.join(':').trim();
      headers.append(key.trim(), value);
    }
  });
  return headers;
};

export const uploadFetch = (
  url: string,
  options: CustomFetchOptions,
): Promise<Response> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
      const headers = parseHeaders(xhr.getAllResponseHeaders() || '');
      const opts = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers,
        url:
          'responseURL' in xhr ? xhr.responseURL : headers.get('X-Request-URL'),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = 'response' in xhr ? xhr.response : (xhr as any).responseText;
      resolve(new Response(body, opts));
    };
    xhr.onerror = () => {
      reject(new TypeError('Network request failed'));
    };
    xhr.ontimeout = () => {
      reject(new TypeError('Network request failed'));
    };
    xhr.open(options.method, url, true);

    if (options.headers) {
      Object.keys(options.headers).forEach((key) => {
        xhr.setRequestHeader(key, options.headers[key]);
      });
    }

    if (xhr.upload && options.onProgress) {
      xhr.upload.onprogress = options.onProgress;
    }

    if (options.onAbortPossible) {
      options.onAbortPossible(() => {
        xhr.abort();
      });
    }

    xhr.send(options.body);
  });

export const customFetch = (
  uri: string,
  options: CustomFetchOptions,
): Promise<Response> => {
  if (options.useUpload) {
    return uploadFetch(uri, options);
  }
  return fetch(uri, options);
};
