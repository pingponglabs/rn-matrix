import chats from './chat';
import matrix from './matrix';
import messages from './message';
import users from './user';

const debug = require('debug')('rnm:services:external.js');

class ExternalService {
  /*************************************************
   * CLIENT METHODS
   *************************************************/

  async createClient(baseUrl, accessToken, userId, deviceId) {
    return matrix.createClient(baseUrl, accessToken, userId, deviceId);
  }

  async start(useCrypto) {
    return matrix.start(useCrypto);
  }

  isReady$() {
    return matrix.isReady$();
  }

  isSynced$() {
    return matrix.isSynced$();
  }

  /*************************************************
   * USER METHODS
   *************************************************/

  getMyUser() {
    return users.getMyUser();
  }

  /*************************************************
   * ROOM METHODS
   *************************************************/

  async createRoom(options = {}) {
    const defaults = {
      visibility: 'private',
      invite: [], // list of user IDs
      room_topic: '',
    };
    return chats.createChat({...defaults, ...options});
  }

  async createEncryptedRoom(usersToInvite) {
    return chats.createEncryptedChat(usersToInvite);
  }

  getRooms$() {
    return chats.getChats();
  }

  getRoomsByType$(type: 'direct' | 'invites' | 'groups') {
    return chats.getListByType$(type);
  }

  getRoomById(roomId: string) {
    return chats.getChatById(roomId);
  }

  joinRoom(roomIdOrAlias: string) {
    chats.joinRoom(roomIdOrAlias);
  }

  leaveRoom(roomId: string) {
    chats.leaveRoom(roomId);
  }

  rejectInvite(roomId: string) {
    chats.leaveRoom(roomId);
  }

  getDirectChat(userId: string) {
    let directMessage = null;
    const joinedChats = chats.getChats().getValue();
    for (let i = 0; i < joinedChats.length && !directMessage; i++) {
      const chat = joinedChats[i];
      const members = chat.getMembers();
      const hasUser = members.find((member) => member.id === userId);
      if (members.length === 2 && hasUser) {
        directMessage = chat;
      }
    }
    return directMessage;
  }

  setRoomName(roomId: string, name: string) {
    const chat = chats.getChatById(roomId);
    chat.setName(name);
  }

  /*************************************************
   * MESSAGE METHODS
   *************************************************/

  send(content, type, roomId, eventId = null) {
    messages.send(content, type, roomId, eventId);
  }

  sendReply(roomId, relatedMessage, messageText) {
    messages.sendReply(roomId, relatedMessage, messageText);
  }

  getMessageById(eventId, roomId, event = null) {
    return messages.getMessageById(eventId, roomId, event);
  }

  deleteMessage(message) {
    const {event} = message.getMatrixEvent();
    const eventId = event.event_id;
    const roomId = event.room_id;
    matrix.getClient().redactEvent(roomId, eventId);
    message.update();
  }

  editMessage(roomId, messageId, newMessageContent) {
    messages.send(newMessageContent, 'm.edit', roomId, messageId);
  }
}

const external = new ExternalService();
export default external;
