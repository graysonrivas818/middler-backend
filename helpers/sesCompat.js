const { Resend } = require('resend');

class SendEmailCommand {
  constructor(input) {
    this.input = input;
  }
}

class SESClient {
  constructor() {
    this.resend = null;
    this.apiKey = process.env.RESEND_API_KEY || '';
    if (this.apiKey) {
      this.resend = new Resend(this.apiKey);
    }
  }

  async send(command) {
    if (!this.resend) {
      throw new Error('RESEND_API_KEY is missing in environment variables');
    }

    const input = command?.input || command;
    const to = input?.Destination?.ToAddresses || [];
    const cc = input?.Destination?.CcAddresses || [];
    const bcc = input?.Destination?.BccAddresses || [];
    const from = input?.Source || process.env.EMAIL_FROM || 'Middler <support@middler.com>';
    const subject = input?.Message?.Subject?.Data || '';
    const html = input?.Message?.Body?.Html?.Data || undefined;
    const text = input?.Message?.Body?.Text?.Data || undefined;
    const replyToList = input?.ReplyToAddresses || undefined;

    const payload = {
      from,
      to,
      cc,
      bcc,
      subject,
      html,
      text,
    };

    if (replyToList && replyToList.length) {
      payload.reply_to = replyToList.length === 1 ? replyToList[0] : replyToList;
    }

    const { data, error } = await this.resend.emails.send(payload);
    if (error) {
      throw new Error(error.message || JSON.stringify(error));
    }

    return {
      MessageId: data?.id,
      provider: 'resend',
    };
  }
}

module.exports = {
  SESClient,
  SendEmailCommand,
};
