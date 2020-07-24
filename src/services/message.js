import showdown from 'showdown';

import matrix from './matrix';
import Message from '../classes/Message';

const debug = require('debug')('rnm:scenes:chat:message:messageService');
const mdConverter = new showdown.Converter();

class MessageService {
  constructor() {
    this._messages = {};
  }

  //* *******************************************************************************
  // Data
  //* *******************************************************************************
  cleanupRoomMessages(roomId, messageList) {
    if (!this._messages[roomId]) return;

    for (const eventId of Object.keys(this._messages[roomId])) {
      if (!messageList.includes(eventId)) delete this._messages[roomId][eventId];
    }
  }

  getMessageById(eventId, roomId, event, pending = false) {
    if (!this._messages[roomId]) this._messages[roomId] = {};
    if (!this._messages[roomId][eventId]) {
      if (eventId) {
        this._messages[roomId][eventId] = new Message(eventId, roomId, event, pending);
      }
    }
    return this._messages[roomId][eventId];
  }

  getMessageByRelationId(eventId, roomId) {
    if (!this._messages[roomId]) return;

    for (const message of Object.values(this._messages[roomId])) {
      // Look in reactions
      const reactions = message.reactions$.getValue();
      if (reactions) {
        for (const userEvents of Object.values(reactions)) {
          const reaction = Object.values(userEvents).find(event => event.eventId === eventId);
          if (reaction) return message;
        }
      }
    }
  }

  subscribe(target) {
    this._subscription = target;
  }

  updateMessage(eventId, roomId) {
    if (!this._messages[roomId] || !this._messages[roomId][eventId]) return;

    this._messages[roomId][eventId].update();
  }

  updateRoomMessages(roomId) {
    if (!this._messages[roomId]) return;

    for (const message of Object.values(this._messages[roomId])) {
      message.update();
    }
  }

  //* *******************************************************************************
  // Helpers
  //* *******************************************************************************

  async send(content, type, roomId, eventId = null) {
    try {
      switch (type) {
        case 'm.text': {
          const html = mdConverter.makeHtml(content);
          // If the message doesn't have markdown, don't send the html
          if (html !== '<p>' + content + '</p>') {
            return matrix.getClient().sendHtmlMessage(roomId, content, html);
          } else {
            return matrix.getClient().sendTextMessage(roomId, content);
          }
        }
        case 'm.image': {
          return matrix.getClient().sendImageMessage(
            roomId,
            content.url,
            {
              w: content.width,
              h: content.height,
              mimetype: content.type,
              size: content.fileSize,
            },
            content.fileName
          );
        }
        case 'm.edit': {
          return matrix.getClient().sendEvent(roomId, 'm.room.message', {
            'm.new_content': { msgtype: 'm.text', body: content },
            'm.relates_to': {
              rel_type: 'm.replace',
              event_id: eventId,
            },
            msgtype: 'm.text',
            body: ` * ${content}`,
          });
        }
        default:
          debug('Unhandled message type to send %s:', type, content);
          return;
      }
    } catch (e) {
      debug('Error sending message:', { roomId, type, content }, e);
    }
  }

  sortByLastSent(messages) {
    const sorted = [...messages];
    sorted.sort((a, b) => {
      return a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0;
    });
    return sorted;
  }
}

const messageService = new MessageService();
export default messageService;
