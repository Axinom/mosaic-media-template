import { Check, Flag, X } from 'lucide-react';
import React from 'react';
import { VerificationActionsProps } from '../../types';
import classes from './VerificationActions.module.scss';

export const VerificationActions: React.FC<VerificationActionsProps> = ({
  onAccept,
  onReject,
  onFlag,
  onCancel,
}) => {
  return (
    <div className={classes.verificationActions}>
      <h4 className={classes.actionsTitle}>Verification Decision</h4>

      <div className={classes.actionsButtons}>
        <button
          className={`${classes.actionButton} ${classes.accept}`}
          onClick={onAccept}
          type="button"
        >
          <Check size={16} />
          Accept Match
        </button>

        <button
          className={`${classes.actionButton} ${classes.reject}`}
          onClick={onReject}
          type="button"
        >
          <X size={16} />
          Reject Match
        </button>

        <button className={`${classes.actionButton} ${classes.flag}`} onClick={onFlag} type="button">
          <Flag size={16} />
          Flag for Review
        </button>

        <button
          className={`${classes.actionButton} ${classes.cancel}`}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
