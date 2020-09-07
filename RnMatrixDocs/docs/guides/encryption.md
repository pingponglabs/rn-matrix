---
id: encryption
title: Enabling Encryption
sidebar_label: Encryption
---

Enabling encryption on the data side just takes two steps.

## If using login function

The last argument to loginWithPassword is false by default - just pass true, and it'll init crypto for that client.

```js
loginWithPassword(username, password, homeserver, initCrypto = false)
```

## If creating client directly

### 1. Pass deviceId to createClient
### 2. Pass "true" to the start function

At the root of your app, you should have something like this:

```js
import { matrix } from 'rn-matrix';
...
matrix.createClient(baseUrl, accessToken, mxid);
matrix.start();
```

After encryption is enabled, it should look like this:

```js
import { matrix } from 'rn-matrix';
...
matrix.createClient(baseUrl, accessToken, mxid, deviceId);
matrix.start(true);
```

The **deviceId** comes from the login, the same place you get the access token.
