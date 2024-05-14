import { Plugin } from 'graphile-build';
/**
 * Plugin transforms SQL function parameters from type `BigFloat` to `Float`.
 */
export const CuePointScheduleBigFloatToFloatPlugin: Plugin = (builder) => {
  builder.hook('GraphQLInputObjectType:fields', (fields, build, context) => {
    // list of input types for the cue point schedules
    const cuePointScheduleTypes = [
      'CreateAdCuePointScheduleInput',
      'CreateVideoCuePointScheduleInput',
      'UpdateAdCuePointScheduleInput',
      'UpdateVideoCuePointScheduleInput',
    ];
    const inputTypeName = context.Self.name;
    if (cuePointScheduleTypes.includes(inputTypeName)) {
      // field `durationInSeconds` requires type change
      if (fields?.durationInSeconds) {
        fields.durationInSeconds.type = build.graphql.GraphQLFloat;
      }
    }
    return fields;
  });
};
