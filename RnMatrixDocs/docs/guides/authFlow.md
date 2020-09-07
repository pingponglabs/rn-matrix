---
id: authFlow
title: Authentication Flow
sidebar_label: Authentication Flow
---

Here is an example of how I recommend loading and displaying the auth flow in your app.

```js
...
import {useObservableState} from 'observable-hooks';
import {matrix} from '@rn-matrix/core';

export default function AppNavigator() {
  const authLoaded = useObservableState(matrix.authIsLoaded$());
  const authLoggedIn = useObservableState(matrix.isLoggedIn$());
  const matrixReady = useObservableState(matrix.isReady$());

  if (!authLoaded || (authLoggedIn && !matrixReady)) {
    return (
      // A loading view
    );
  } else if (authLoggedIn) {
    return (
      // UI for the app - your chat screen, etc
    );
  } else {
    return (
      // UI for logging in
    );
  }
}
```