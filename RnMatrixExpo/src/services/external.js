import chats from './chat';
import matrix from './matrix';
import messages from './message';
import users from './user';
import auth from './auth';

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

  async getHomeserverData(domain) {
    return matrix.getHomeserverData(domain);
  }

  getClient() {
    return matrix.getClient();
  }

  /*************************************************
   * AUTH METHODS
   *************************************************/

  initAuth() {
    return auth.init();
  }

  loginWithPassword(username, password, homeserver, initCrypto = false) {
    return auth.loginWithPassword(username, password, homeserver, initCrypto);
  }

  logout() {
    return auth.logout();
  }

  /*************************************************
   * VALUES
   *************************************************/

  isReady$() {
    return matrix.isReady$();
  }

  isSynced$() {
    return matrix.isSynced$();
  }

  authIsLoaded$() {
    return auth.isLoaded$();
  }

  isLoggedIn$() {
    return auth.isLoggedIn$();
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
    return chats.createChat({ ...defaults, ...options });
  }

  async createEncryptedRoom(usersToInvite) {
    return chats.createEncryptedChat(usersToInvite);
  }

  getRooms$(slim = false) {
    return chats.getChats(slim);
  }

  getRoomsByType$(type) {
    return chats.getListByType$(type);
  }

  getRoomById(roomId) {
    return chats.getChatById(roomId);
  }

  joinRoom(roomIdOrAlias) {
    chats.joinRoom(roomIdOrAlias);
  }

  leaveRoom(roomId) {
    chats.leaveRoom(roomId);
  }

  rejectInvite(roomId) {
    chats.leaveRoom(roomId);
  }

  getDirectChat(userId) {
    let directMessage = null;
    const joinedChats = chats.getChats(false).getValue();
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

  setRoomName(roomId, name) {
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
    const { event } = message.getMatrixEvent();
    const eventId = event.event_id;
    const roomId = event.room_id;
    matrix.getClient().redactEvent(roomId, eventId);
    message.update();
  }

  editMessage(roomId, messageId, newMessageContent) {
    messages.send(newMessageContent, 'm.edit', roomId, messageId);
  }

  /*************************************************
   * User Methods
   *************************************************/

  getKnownUsers() {
    return users.getKnownUsers();
  }

  async searchUsers(searchTerm) {
    return await users.searchUsers(searchTerm);
  }

  getUserById(userId) {
    return users.getUserById(userId);
  }

  /*************************************************
   * HELPERS
   *************************************************/

  getHttpUrl(mxcUrl, width = null, height = null, resizeMethod = 'scale') {
    return matrix.getHttpUrl(mxcUrl, width, height, resizeMethod);
  }
}

const external = new ExternalService();
export default external;
