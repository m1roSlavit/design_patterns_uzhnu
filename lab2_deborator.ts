const fs = require('node:fs');

class TextMessage {
  text: string;
  sendTimeUTC: number;
  receiverId: number;

  constructor(text: string, receiverId: number) {
    this.text = text;
    this.sendTimeUTC = Date.now();
    this.receiverId = receiverId;
  }
}

type ITextMessageSender = {
  getFormattedMessageText: (message: TextMessage) => string;
  send: (message: TextMessage) => boolean;
};

class TextMessageSender implements ITextMessageSender {
  getFormattedMessageText({ text, receiverId, sendTimeUTC }: TextMessage) {
    const formattedDate = new Date(sendTimeUTC).toLocaleDateString();
    return `${formattedDate} | You get message '${text}' from ${receiverId}`;
  }

  send(message: TextMessage) {
    console.log(this.getFormattedMessageText(message));
    return true;
  }
}

const userBlacklistIds = [1, 2, 3];

class TextMessageSenderDecorator implements ITextMessageSender {
  textMessageSender: TextMessageSender;

  constructor(textMessageSender: TextMessageSender) {
    this.textMessageSender = textMessageSender;
  }

  logMessage(message: TextMessage) {
    fs.writeFile(
      './lab2_logs.txt',
      `${message.sendTimeUTC} | message was sended${message.text} \n`,
      { flag: 'a+' },
      () => {}
    );
  }

  getFormattedMessageText(message: TextMessage) {
    return this.textMessageSender.getFormattedMessageText(message);
  }

  send(message: TextMessage) {
    if (userBlacklistIds.includes(message.receiverId))
      throw new Error('user in blacklist');

    this.logMessage(message);

    return this.textMessageSender.send(message);
  }
}

const sender = new TextMessageSenderDecorator(new TextMessageSender());

try {
  sender.send(new TextMessage('Not Hello ;/', 5));
  sender.send(new TextMessage('he he', 10));
  sender.send(new TextMessage('Hello', 2));
} catch {
  console.log('ops...');
}
