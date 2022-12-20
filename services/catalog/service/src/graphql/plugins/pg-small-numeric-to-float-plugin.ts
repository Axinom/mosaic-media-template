import { Plugin } from 'graphile-build';

/**
 * Source: https://www.graphile.org/postgraphile/plugin-gallery/#Types__PgSmallNumericToFloatPlugin
 *
 * This plugin will have PostGraphile use `GraphQLFloat` instead of `BigFloat`
 * for DECIMAL / NUMERIC values that have a precision and scale under the given
 * limits (original 12 and 2, currently 13 and 5 respectively). From the API
 * perspective, this changes the returned type from string to number with
 * floating point.
 *
 * It's generally a bad idea to use floating point numbers to represent
 * arbitrary precision numbers such as NUMERIC because loss of precision can
 * occur; however in our case this is acceptable.
 */
export const PgSmallNumericToFloatPlugin: Plugin = (
  builder,
  { pgNumericToFloatPrecisionCap = 13, pgNumericToFloatScaleCap = 5 },
) => {
  builder.hook('build', (build) => {
    // Register a type handler for NUMERIC / DECIMAL (oid = 1700)
    build.pgRegisterGqlTypeByTypeId(
      '1700',
      (_set: unknown, modifier: number) => {
        if (modifier && typeof modifier === 'number' && modifier > 0) {
          // Ref: https://stackoverflow.com/a/3351120/141284
          const precision = ((modifier - 4) >> 16) & 65535;
          const scale = (modifier - 4) & 65535;
          if (
            precision <= pgNumericToFloatPrecisionCap &&
            scale <= pgNumericToFloatScaleCap
          ) {
            // This number is no more precise than our cap, so we're declaring
            // that we can handle it as a float:
            return build.graphql.GraphQLFloat;
          }
        }
        // If all else fails, let PostGraphile do it's default handling - i.e.
        // BigFloat
        return null;
      },
    );

    // We didn't modify _init, but we still must return it.
    return build;
  });
};
