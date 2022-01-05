---
id: room
title: The "Chat" class
sidebar_label: Chat (Class)
---

This represents a "room" in the Matrix ecosystem. However, this is a customized Chat object in `rn-matrix` - below are convenience methods you can use with a Chat object.

## Properties

These properties end with \$ to indicate that they are [Behavior Subjects](https://rxjs-dev.firebaseapp.com/guide/subject#behaviorsubject). This means that you can get live updates when these are changed by using `useObservableState`.
<br />Example:

```js
import { matrix } from 'rn-matrix'
import { useObservableState } from 'observable-hooks'
...
const room = matrix.getRoomById('roomId')
const roomName = useObservableState(room.name$)
const snippet = useObservableState(room.snippet$)
// Both roomName and snippet will be updated when events happen
```

If you want to get the static current value of a variable, just call `room.name\$.getValue()

### `name$`

The name of the room.

### `isDirect$`

Boolean; if this room is considered "direct".

### `typing$`

An array of user IDs that are typing in this room.

### `messages$`

The list of messages in this room.

### `snippet$`

What should show on the chat list screen - a portion of the lastest message, or the names of users who are typing.

### `readState$`

### `atStart$`

### `members$`

Array of User objects currently joined in the room.

## Methods

### `sendMessage`

`sendMessage(content, type)`

### `sendReadReceipt`

`sendReadReceipt()`

### `setTyping`

`setTyping(isTyping)`

### `getAvatarUrl`

`getAvatarUrl(size)`

### `leave`

`leave()`

### `fetchPreviousMessages`

`fetchPreviousMessages()`

### `setName`

`setName(name)`
