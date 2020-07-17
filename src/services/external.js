import chats from './chat';
import matrix from './matrix';

const debug = require('debug')('rnm:services:external.js');

class ExternalService {
  async createClient(baseUrl, accessToken, userId) {
    return matrix.createClient(baseUrl, accessToken, userId);
  }

  async start() {
    return matrix.start();
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

  getRoomById(roomId: string) {
    return chats.getChatById(roomId);
  }
}

const external = new ExternalService();
export default external;
