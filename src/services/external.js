import chats from './chat';
import matrix from './matrix';
import messages from './message';

const debug = require('debug')('rnm:services:external.js');

class ExternalService {
  async createClient(baseUrl, accessToken, userId, deviceId) {
    return matrix.createClient(baseUrl, accessToken, userId, deviceId);
  }

  async start(useCrypto) {
    return matrix.start(useCrypto);
  }

  deleteMessage(message) {
    const { event } = message.getMatrixEvent();
    const eventId = event.event_id;
    const roomId = event.room_id;
    matrix.getClient().redactEvent(roomId, eventId);
    message.update();
  }

  async createRoom(options = {}) {
    const defaults = {
      visibility: 'private',
      invite: [], // list of user IDs
      room_topic: '',
    };
    return chats.createChat({ ...defaults, ...options });
  }

  getRooms() {
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

  getDirectMessage(userId: string) {
    let directMessage = null;
    const joinedChats = chats.getChats().getValue();
    for (let i = 0; i < joinedChats.length && !directMessage; i++) {
      const chat = joinedChats[i];
      const members = chat.getMembers();
      const hasUser = members.find(member => member.id === userId);
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

  editMessage(roomId, messageId, newMessageContent) {
    messages.send(newMessageContent, 'm.edit', roomId, messageId);
  }
}

const external = new ExternalService();
export default external;
