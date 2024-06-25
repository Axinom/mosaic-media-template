import { Button, ButtonContext, IconName, InlineMenu } from '@axinom/mosaic-ui';
import clsx from 'clsx';
import React from 'react';
import { HeaderProps } from '../ProgramManagement.types';
import classes from './Header.module.scss';

export const Header: React.FC<HeaderProps> = ({
  actions,
  addActions,
  isOpen,
  onToggleClick,
}) => {
  const { label } = classes;

  return (
    <div className={classes.container} data-test-id="program-form-header">
      <div className={classes.sections}>
        <div className={classes.timeSlot}>
          <p>Start Time</p>
        </div>
        <div className={classes.columns}>
          <div className={label}>
            <Button
              icon={IconName.ChevronRight}
              onButtonClicked={onToggleClick}
              className={clsx(classes.chevron, { [classes.closed]: !isOpen })}
              buttonContext={ButtonContext.None}
            />
          </div>
          <div className={label}>
            <p>Title</p>
          </div>
          <div className={label}>
            <p>Entity Type</p>
          </div>
          <div className={label}>
            <p>Duration</p>
          </div>
          <div className={label}>
            <p>Cue Points</p>
          </div>
          <div className={label}></div>
        </div>
      </div>
      <div className={classes.actions}>
        <InlineMenu
          placement="bottom-end"
          showArrow={false}
          addBackgroundOpacity={false}
          actions={actions}
        />
        <InlineMenu
          placement="bottom-end"
          showArrow={false}
          addBackgroundOpacity={false}
          actions={addActions}
          buttonIcon={IconName.Plus}
          buttonContext={ButtonContext.Active}
        />
      </div>
    </div>
  );
};
