import { Injectable } from '@nestjs/common';
import { AuthConfigService } from 'src/common/config/auth.config';
import { MailService } from 'src/mail/services/mail.service';

const TEMPLATE = './mail-template';

export interface LoginEmail {
  to: string;
  link: string;
  code: string;
  /** "te autentifici în VIC": the client app the login is for, when there is one. */
  clientName?: string;
}

/** Builds the links the auth emails point at and queues them through MailService. */
@Injectable()
export class AuthMailerService {
  constructor(
    private readonly mailService: MailService,
    private readonly authConfig: AuthConfigService,
  ) {}

  public loginLinkUrl(secret: string): string {
    return `${this.authConfig.webAppUrl}/login/link?token=${encodeURIComponent(secret)}`;
  }

  public async sendLogin({
    to,
    link,
    code,
    clientName,
  }: LoginEmail): Promise<void> {
    const target = clientName ? `în ${clientName} prin NGO Hub` : 'în NGO Hub';
    await this.send({
      to,
      subject: `Codul tău de autentificare: ${code}`,
      context: {
        title: `Autentificare ${target}`,
        subtitle:
          `Folosește codul de mai jos sau butonul pentru a te autentifica ${target}. ` +
          'Codul și linkul sunt valabile 15 minute și pot fi folosite o singură dată. ' +
          'Dacă nu ai cerut tu acest e-mail, îl poți ignora.',
        code,
        cta: { link: this.loginLinkUrl(link), label: 'Autentifică-te' },
      },
    });
  }

  public async sendInvite(
    to: string,
    link: string,
    code: string,
  ): Promise<void> {
    await this.send({
      to,
      subject: 'Ai fost invitat în NGO Hub',
      context: {
        title: 'Bine ai venit în NGO Hub',
        subtitle:
          'Ai fost adăugat în contul organizației tale din NGO Hub. Autentificarea se face fără parolă: ' +
          'folosește butonul de mai jos sau codul. Linkul este valabil 30 de zile.',
        code,
        cta: { link: this.loginLinkUrl(link), label: 'Intră în NGO Hub' },
      },
    });
  }

  /**
   * The HTML template plus a plain-text part with the same words, code and
   * link: readable in text-only clients and when images are blocked.
   */
  private async send(email: {
    to: string;
    subject: string;
    context: {
      title: string;
      subtitle: string;
      code: string;
      cta: { link: string; label: string };
    };
  }): Promise<void> {
    const { title, subtitle, code, cta } = email.context;
    const text = [
      title,
      '',
      subtitle,
      '',
      `Cod: ${code}`,
      '',
      `${cta.label}: ${cta.link}`,
      '',
      'Cu drag,',
      'Echipa NGO Hub',
    ].join('\n');
    await this.mailService.sendEmail({ ...email, template: TEMPLATE, text });
  }
}
