import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailConfigService {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: this.configService.get('MAIL_HOST'),
        port: +this.configService.get('MAIL_PORT'),
        ignoreTLS: false, // - if this is true and secure is false then TLS is not used even if the server supports STARTTLS extension
        secure: false, // – if true the connection will use TLS when connecting to server. If false (the default) then TLS is used if server supports the STARTTLS extension. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false
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
        adapter: new HandlebarsAdapter({ asset_url: this.createAssetUrl }),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: __dirname + '/../../mail/templates/' + 'partials',
          options: {
            strict: true,
          },
        },
      },
    };
  }

  createAssetUrl = (assetName: string) => {
    return `${this.configService.get(
      'AWS_S3_BUCKET_NAME_PUBLIC',
    )}/${assetName}`;
  };
}
