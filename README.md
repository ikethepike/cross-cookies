# Cross domain cookies + localStorage

Hey boys, just drafted up a quick example of a next setup with crossdomain cookies. Sitting in a 6 hour drive from Oslo to Stockholm, so had some free time. ✌️

Hopefully somewhat useful

The relevant files are:

- `src/app/page.tsx` <- with iframe set to the other domain
- `src/pages/shared-tokens.tsx` <- empty page that also sets localStorage on 201. You'd need to fix the server side logic though to make sure it returns the cookie to set localStorage on 200.
- `src/pages/api/shared-tokens.ts` <- basic api endpoint that sets a cookie containing sessionId, cartToken and source.

You'd have to update the trigger the iframe on receipt of a brink cart session token. But it should reliably set a cookie+localStorage - depending on what's easier within your cache setup.

Oh and as a really sleazy hail mary there's some nasty fingerprinting too - but obvs not super secure. You could set up an upstash registry of fingerprints tied to sessions, but again, not safe.
