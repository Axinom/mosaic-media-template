# Catalog Service

## Overview

This is the catalog service, a public-facing service that provides content
exploration and search functionality for end-user frontend applications.

## Setup and Startup

- Check the root `README.md` file and follow the setup instructions.
- Potential customizations/deviations: check the file `.env` and modify any of
  the variables that might be different in your development environment.
- Run `yarn dev` to start (only) this service. Otherwise run `yarn dev:services`
  on the root to start all backend services.
- For more info on working with database migrations see
  [the corresponding `README`](../service/migrations/README.md).

### Notes on message handling

Each content type is expected to send publish/unpublish to a topic that follows
the following convention:

```
<content_type>.<publish|unpublish>.<content_id>
# e.g.
movie.publish.movie-123
movie.unpublish.movie-123
```

Currently each content type binds publish events to a dedicated queue with
`<content_type>.publish.*`. Unpublishing events are funneled to a single queue
with `*.unpublish.*`.
