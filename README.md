# Cross domain cookies + localStorage

Hey boys, just drafted up a quick example of a next setup with crossdomain cookies. Sitting in a 6 hour drive from Oslo to Stockholm, so had some free time. ✌️

Hopefully some part of it is useful.

The relevant files are:

- `src/app/layout.tsx` <- with iframe set to the other domain
- `src/pages/shared-tokens.tsx` <- empty page that also sets localStorage on 201
- `src/pages/api/shared-tokens.ts` <- basic api endpoint that sets a cookie containing sessionId, cartToken and source.

You'd have to update the trigger the iframe on receipt of a brink cart session token. But it should reliably set a cookie+localStorage - depending on what's easier within your cache setup.
