---
id: roomList
title: Exported "RoomList" Component
sidebar_label: RoomList
---

This component is an "inbox" view for your Matrix client.

## Props

### `renderListItem`

`renderListItem({item, index, separators})`

Directly passed to "renderItem" of a [FlatList](https://reactnative.dev/docs/flatlist#renderitem).

"item" is a Room object, containing all data needed to render a room.

By default, RoomList has a default render function which shows a basic inbox.

```
import {RoomList} from 'rn-matrix';
...
const myRenderFunction = ({item, index, separators}) => {
  // return your list item here
}
...
<RoomList renderListItem={myRenderFunction} />
```

### `renderInvite`

`renderInvite({item})`

Directly passed to "renderItem" of a [FlatList](https://reactnative.dev/docs/flatlist#renderitem).

"item" is a Chat object, containing all data needed to render a room. This is a Chat object you are INVITED to, not one you've joined.

By default, RoomList has a default render function which shows a row with the room name and accept / reject invite buttons.

```
import {RoomList} from 'rn-matrix';
...
const myRenderFunction = ({item}) => {
  // return your invite item here
}
...
<RoomList renderInvite={myRenderFunction} />
```

### `onRowPress`

`onRowPress(Room)`

If using the default inbox, this function is called when a row item is pressed.

Typically, you should put a navigation action in this function to go to the chat room for the room that was pressed.

```
const navToChatScreen = (room) => {
  // navigate to the chat screen
}
...
<RoomList onRowPress={navToChatScreen} />
```
