# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.15 - Unreleased]

### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [0.0.14 - Unreleased]

### Added

- End to end encryption!
- added "getClient" method
- added "joinRoom" method
- added "leaveRoom" method
- added "rejectInvite" method

### Changed

- the buttons on the invite row work now

## [0.0.12 - 7/26/2020]

### Added

- Mostly handled way to edit messages with the built in composer

### Removed

- accidental console.log

### Fixed

- keys needed for invite list
- our Composer woes (Composer hiding messages in the list)

## [0.0.11 - 7/23/2020]

### Added

- `getDirectMessage` method (to see if you already have a DM with a person)
- `enableComposer` prop for MessageList
- `setRoomName` on exported `matrix` module & `setName` on Chat class
- `setAvatar` on the Chat class
- Indicator for sending / sent on a message
- `editMessage` method

## [0.0.9 - 7/16/2020]

### Added

- AsyncStorage for use with Matrix Memory Store
- Snippet on chat list shows name for group chats
- Better logging for failed chat creation
- Added method for getting list of rooms
- Added method for getting room by ID

### Changed

- Wrapped MessageList in a SafeAreaView

## [0.0.8 - 7/8/2020]

### Added

- "deleteMessage" method
- "createRoom" method

## [0.0.7 - 7/4/2020]

### Added

- Reaction support 😊
- Color constants

### Fixed

- Keyboard shenanigans on Android
- Some prop declarations

## [0.0.6 - 7/3/2020]

### Fixed

- Commented out Example App (whoops)
- Corrected "required" status of RoomList and MessageList props

## [0.0.4 - 6/26/2020]

### Added

- localization with i18next
- animated typing indicator
- added "press" and "long press" props to message list
- custom typing indicator
- ability to send message with a provided composer

### Fixed

- rendering unordered lists

## [0.0.3 - 6/18/2020]

### Added

- License
- README
- Styles for the MessageList component
- HTML rendering for messages (native library: react-native-webview)

### Changed

- Updated package.json to reflect repository, docs, and license
