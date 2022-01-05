---
id: matrix
title: Exported "matrix" module
sidebar_label: matrix
---

This exported variable contains \***\*all data methods from `rn-matrix`.\*\*** Anything you want to do with data can probably be done with `matrix.*`

This variable differs from the exported `matrixSdk` in that `matrixSdk` is the original export from the `matrix-js-sdk`, so if `rn-matrix` limits you in any way, you can see if the `matrix-js-sdk` can solve your problem.

# Methods

## Core

### `createClient`

`createClient(baseUrl, accessToken, MXID, deviceId)`

Creates a new instance of a Matrix Client.
| Prop | Type | Description |
| ----------- | ------ | ----------------------------------------------------------- |
| baseUrl | string | The URL of the homeserver the client should connect to. |
| accessToken | string | The access token of the user you want to log in. |
| MXID | string | The MXID (@john:matrix.org) of the user you want to log in. |
| deviceId | string | (Only required for encryption) The device ID returned from the call to login. |

```
import {matrix} from 'rn-matrix';
...
const accessToken = 'asdf';
const deviceId = '1234';
matrix.createClient('https://matrix.ditto.chat', accessToken, '@test:ditto.chat', deviceId);
```

### `start`

`start(useCrypto)`

Starts the client. Required early on in app start so that the client can begin listening for events.
| Prop | Type | Description |
| ----------- | ------ | ----------------------------------------------------------- |
| useCrypto | boolean | (Default false) Enables end to end encryption. |

**Must happen after creating the client.**

```
import { matrix } from 'rn-matrix';
...
matrix.start();
```

## Rooms

### `createRoom`

`createRoom(options)`

Creates a room and returns its details
| Prop | Type | Description | Example |
| ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| options | object | {<br />**visibility**: 'private' or 'public',<br />**invite**: array of userId strings,<br />**name**: string for name,<br />**room_topic**: string for topic<br />} | {<br />**visibility**: 'private',<br />**invite**: ['@annie:ditto.chat'],<br />**name**: 'New Room',<br />**room_topic**: ''<br />} |

#### Returns

```js
{
  id, // the id of the new room
    name; // the name you used, or the default
}
```

You can use the information returned to navigate to the created chat.

```js
import { matrix } from 'rn-matrix'
...
// any excluded options will use the defaults
const options = {
  visibility: 'public',
  invite: ['@annie:ditto.chat', '@test:ditto.chat'], // can be empty
  name: 'My Cool New Room',
  room_topic: 'Here\'s a place for us to chat about RnMatrix!'
}
const room = await matrix.createRoom(options)
console.log(room) // { id: <room id>, name: <room name> }
```

### `getRooms$`

`getRooms()`

#### Returns

[Behavior subject](https://rxjs-dev.firebaseapp.com/guide/subject#behaviorsubject) for the list of all rooms.<br />
We use behavior subjects because when you reference this list, you can use `useObservableState` from `observable-hooks` to have it automatically update when events happen. <br /><br />
In order to get the array, call `.getValue()`

```js
import { matrix } from 'rn-matrix'
import { useObservableState } from 'observable-hooks'
...
const rooms = matrix.getRooms()
const updatingRooms = useObservableState(matrix.getRooms())
console.log(rooms) // BehaviorSubject
console.log(rooms.getValue()) // Array of Chats
console.log(updatingRooms) // This will update when the room list is updated
```

### `getRoomById`

`getRoomById(roomId)`

#### Returns

A Chat class object (yes, I should refactor this to be called a "Room")

A Chat class object has Behavior Subjects that can be used with `useObservableState` to listen for updates. These can be found in [these docs](api/room.md).

For example, if I want to get the chat name:

```js
import { matrix } from 'rn-matrix'
import { useObservableState } from 'observable-hooks'
...
const room = matrix.getRoomById('roomId')
const roomName = useObservableState(room.name$)
console.log(roomName) // Will update if the room name is changed
```

### `getRoomsByType$`

`getRoomsByType$(type: 'direct' | 'invites' | 'groups')`

#### Returns

A Behavior Subject for the list of rooms, filtered by type given.

```js
import { matrix } from 'rn-matrix'
import { useObservableState } from 'observable-hooks'
...
const directChats = useObservableState(matrix.getRoomsByType$('direct'))
console.log(directChats) // Will update if the direct chats are changed
```

### `getDirectMessage`

`getDirectMessage(userId)`

#### Returns

A Chat class object which contains only you and the userID indicated (can be used to simulate canonical DMs)

### `setRoomName`

`setRoomName(roomId, name)`

Sets the name for the specified room ID. You can also set the name directly with the Chat object (see [Chat docs](room#setname)).

### `leaveRoom`

`leaveRoom(roomId)`

Leaves the room with the given ID.

### `joinRoom`

`joinRoom(roomId)`

Joins the given room ID (if possible).

### `rejectInvite`

`rejectInvite(roomId)`

Rejects the invite for a room you were invited to - actually just calls "leaveRoom" behind the scenes.

## Messages

### `deleteMessage`

`deleteMessage(message)`

Deletes a message (View guide)
| Prop | Type | Description |
| ------- | ------- | ----------------------------------------------- |
| message | Message | The message (of type "Message" class) to delete |

```
import {matrix} from 'rn-matrix';
...
matrix.deleteMessage(message);
```
