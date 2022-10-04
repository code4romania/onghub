import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class EmailConfigService {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get('MAIL_HOST'),
        port: +this.configService.get('MAIL_PORT'),
        ignoreTLS: true,
        secure: false,
        auth: {
          user: this.configService.get('MAIL_USER'),
          pass: this.configService.get('MAIL_PASS'),
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      preview: true,
      template: {
        dir: __dirname + '/../../mail/templates',
        adapter: new HandlebarsAdapter({'asset_url': this.createAssetUrl}),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: __dirname + '/../../mail/templates/' + 'partials',
          options: {
            strict: true
          },
        },
      },
    };
  }

  createAssetUrl = (assetName: string) => {
    return join(this.configService.get('ASSETS_ENDPOINT'), assetName);
  }
}
