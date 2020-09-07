---
id: managingMessages
title: Managing Messages
sidebar_label: Managing Messages
---

## Copy Message Text

```js
import {matrix} from 'rn-matrix';
import {Clipboard} from 'react-native';
...
export default ChatScreen({ route }) {
  // Any actions done from an Action Sheet will happen to this message.
  const [selectedMessage, setSelectedMessage] = useState(null)

  const { room } = route.params;

  const copyMessage = () => {
    // This function will be called when your user pressed "copy"
    // in your Action Sheet.
    Clipboard.setString(selectedMessage.content$.getValue())
    // Maybe show a toast, confirming the message was copied
    setSelectedMessage(null)
  }

  useEffect(() => {
    if (selectedMessage) {
      // show your action sheet with options like delete, copy, etc
    } else {
      // hide action sheet
    }
  }, [selectedMessage])

  return (
    <>
      <MessageList room={room} onPress={setSelectedMessage} />
      <ActionSheet copyMessage={copyMessage} />
    </>
  )
}
```

## Delete a Message

When deleting a message, you'll want to add the "selected" message in the state of your component holding the MessageList.
I recommend something like this:

```js
import {matrix} from 'rn-matrix';
...
export default ChatScreen({ route }) {
  // Any actions done from an Action Sheet will happen to this message.
  const [selectedMessage, setSelectedMessage] = useState(null)

  const { room } = route.params;

  const deleteMessage = () => {
    // This function will be called when your user pressed "delete"
    // in your Action Sheet.
    // You could also prompt the user if they're *sure* they want to delete.
    matrix.deleteMessage(selectedMessage)
    setSelectedMessage(null)
  }

  useEffect(() => {
    if (selectedMessage) {
      // show your action sheet with options like delete, copy, etc
    } else {
      // hide action sheet
    }
  }, [selectedMessage])

  return (
    <>
      <MessageList room={room} onPress={setSelectedMessage} />
      <ActionSheet deleteMessage={deleteMessage} />
    </>
  )
}
```

## Edit a Message

Coming soon!
