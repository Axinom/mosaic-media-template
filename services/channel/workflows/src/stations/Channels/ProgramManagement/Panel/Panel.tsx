import { InfoPanel, Paragraph, Section } from '@axinom/mosaic-ui';
import React, { useContext } from 'react';
import { ProgramManagementContext } from '../ProgramManagementProvider/ProgramManagementProvider';
import classes from './Panel.module.scss';

export const Panel: React.FC = () => {
  const {
    metadata: {
      playListDuration,
      playListEndTime,
      playListStartTime,
      entityTypeCounts,
    },
  } = useContext(ProgramManagementContext);

  return (
    <InfoPanel>
      <Section title="Additional Information">
        <Paragraph title="Start Time">{playListStartTime}</Paragraph>
        <Paragraph title="End Time">{playListEndTime}</Paragraph>
        <Paragraph title="Playlist Duration">{playListDuration}</Paragraph>
      </Section>
      {entityTypeCounts && (
        <Section title="Components Overview">
          <div className={classes.componentsContainer}>
            {Object.keys(entityTypeCounts).map((entityType) => (
              <React.Fragment key={entityType}>
                <div>{entityType}</div>
                <div>{entityTypeCounts[entityType]}</div>
              </React.Fragment>
            ))}
          </div>
        </Section>
      )}
    </InfoPanel>
  );
};
