import { ISendMailOptions } from '@nestjs-modules/mailer';

/**
 * Replaces MailService in tests: nothing is queued or sent; specs read codes
 * and links out of `sent`, the way a user reads them out of the email.
 */
export class FakeMailService {
  public readonly sent: ISendMailOptions[] = [];

  async sendEmail(email: ISendMailOptions): Promise<void> {
    this.sent.push(email);
  }

  to(address: string): ISendMailOptions[] {
    return this.sent.filter((email) => [].concat(email.to).includes(address));
  }

  last(address?: string): ISendMailOptions {
    const emails = address ? this.to(address) : this.sent;
    return emails[emails.length - 1];
  }

  clear(): void {
    this.sent.length = 0;
  }
}
