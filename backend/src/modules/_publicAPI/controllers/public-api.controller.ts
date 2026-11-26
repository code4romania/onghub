import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { MailService } from 'src/mail/services/mail.service';
import { ContactMailDto } from '../dto/contact-mail.dto';

// hasAccess (HMAC), /api/ong-user and /api/generate-keys were for Cognito-era clients and went with it
// (O16): client apps log in with NGO Hub OIDC and read the organization from /oidc/me.
@Controller('api')
export class PublicAPIController {
  constructor(private readonly mailService: MailService) {}

  @Public()
  @Throttle({ default: { limit: 1, ttl: 60 * 1000 } })
  @ApiBody({ type: ContactMailDto })
  @Post('/contact')
  async sendMail(@Body() mailOptions: ContactMailDto): Promise<void> {
    await this.mailService.sendEmail({
      to: process.env.MAIL_CONTACT,
      subject: `Contact ${mailOptions.type} - ${mailOptions.sender}`,
      html: `<p>${mailOptions.text}</p>`,
      ...mailOptions,
    });
  }
}
