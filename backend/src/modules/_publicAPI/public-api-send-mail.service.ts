import { Injectable } from '@nestjs/common';
import { MailService } from 'src/mail/services/mail.service';
import { ContactMailDto } from './dto/contact-mail.dto';

@Injectable()
export class PublicApiSendMailService {
  constructor(private readonly mailService: MailService) {}

  public async sendMail(mailOptions: ContactMailDto): Promise<void> {
    await this.mailService.sendEmail({
      to: 'ilijah.carl@minutestep.com',
      subject: `Feedback - ${mailOptions.sender}`,
      html: `<p>${mailOptions.text}</p>`,
      ...mailOptions,
    });
  }
}
