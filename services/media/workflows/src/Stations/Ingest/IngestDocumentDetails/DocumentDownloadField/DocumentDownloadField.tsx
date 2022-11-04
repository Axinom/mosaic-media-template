import { LinkField, LinkFieldProps } from '@axinom/mosaic-ui';
import React from 'react';

interface DocumentDownloadFieldProps extends LinkFieldProps {
  fileName: string;
}

export const DocumentDownloadField: React.FC<DocumentDownloadFieldProps> = ({
  id,
  label = '',
  value = {},
  fileName = 'file.json',
}) => {
  const fileBlob = new Blob([JSON.stringify(value, undefined, 2)], {
    type: 'application/json',
  });

  return (
    <LinkField
      id={id}
      label={label}
      download={fileName}
      url={URL.createObjectURL(fileBlob)}
      value={fileName}
    />
  );
};
