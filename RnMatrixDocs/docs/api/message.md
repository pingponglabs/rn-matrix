---
id: message
title: The "Message" class
sidebar_label: Message (Class)
---

This represents a "message" in the Matrix ecosystem.

## Properties

Properties that end with \$ to indicate that they are [Behavior Subjects](https://rxjs-dev.firebaseapp.com/guide/subject#behaviorsubject). This means that you can get live updates when these are changed by using `useObservableState`.
<br />Example:

```js
import { matrix } from 'rn-matrix'
import { useObservableState } from 'observable-hooks'
...
// Example using a matrix room
const room = matrix.getRoomById('roomId')
const roomName = useObservableState(room.name$)
const snippet = useObservableState(room.snippet$)
// Both roomName and snippet will be updated when events happen
```

If you want to get the static current value of a variable, just call `message.type\$.getValue()

### `sender`

A User object, the sender of this message.

### `timestamp`

The event timestamp, e.g. 1433502692297

### `type$`

The event type, e.g. `m.text` or `m.room.avatar`

### `status$`

One of:

| Name     | Type   | Description                                           |
| -------- | ------ | ----------------------------------------------------- |
| NOT_SENT | string | The event was not sent and will no longer be retried. |
| SENDING  | string | The event is in the process of being sent.            |
| QUEUED   | string | The event is in a queue waiting to be sent.           |

### `redacted$`

A boolean if the event is redacted.

### `content$`

The messages `content` object - this could include photo or video urls for media messages, html for formatted messages, things like that.

### `reactions$`

An array of reactions on the current message.

### `receipts$`

A list of users whose "fully read" receipt is on this message.

## Methods

### `addReaction`

`addReaction(key: string)`

### `removeReaction`

`removeReaction(key: string)`

### `toggleReaction`

`toggleReaction(key: string)`

### `static getType`

`getType(matrixEvent)` where `matrixEvent` is the actual... Matrix event

### `static isBubbleMessage`

`isBubbleMessage(message)` where message is a Message

### `static isEventDisplayed`

`isEventDisplayed(matrixEvent)`

### `static isEventMessage`

`isEventMessage(type)` where `type` is a "message type" e.g. `m.text`, `m.room.avatar`, etc

### `static isImageMessage`

`isImageMessage(type)`

### `static isMessageUpdate`

`isMessageUpdate(matrixEvent)`

### `static isNoticeMessage`

`isNoticeMessage(type)`

### `static isTextMessage`

`isTextMessage(type)`
