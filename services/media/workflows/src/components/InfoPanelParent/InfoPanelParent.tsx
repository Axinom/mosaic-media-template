import { IconName, InlineMenu } from '@axinom/mosaic-ui';
import React from 'react';
import { ExtensionParams, ImagePreviewProps } from '../../externals';
import fb from '../../images/default-image.svg';
import classes from './InfoPanelParent.module.scss';

interface ParentProps {
  Thumbnail: React.FC<ExtensionParams<ImagePreviewProps>>;
  imageId?: string;
  path: string;
  label: string;
  title?: string;
}

export const InfoPanelParent: React.FC<ParentProps> = ({
  Thumbnail,
  imageId = '',
  path,
  label,
  title,
}) => {
  return (
    <div className={classes.container}>
      <Thumbnail
        params={{
          id: imageId,
          type: 'thumbnail',
          fallbackSrc: fb,
        }}
      />
      <p>{title ?? ''}</p>
      <InlineMenu
        placement="bottom-end"
        showArrow={false}
        addBackgroundOpacity={false}
        actions={[
          {
            label,
            icon: IconName.NavigateRight,
            path,
            openInNewTab: true,
          },
        ]}
      />
    </div>
  );
};
