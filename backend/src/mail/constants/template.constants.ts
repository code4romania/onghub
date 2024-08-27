const ORGANIZATION_REQUEST = './mail-template';

export interface IMailOptions {
  template: string;
  subject: string;
  context: {
    title: string;
    subtitle: (...args: string[]) => string;
    cta?: { link: (link?: string) => string; label: string };
  };
}

export const MAIL_OPTIONS: Record<string, IMailOptions> = {
  ORGANIZATION_CREATE_ADMIN: {
    template: ORGANIZATION_REQUEST,
    subject: 'NGO Hub - Solicitare creare cont organizație',
    context: {
      title: 'Ești doar la un pas de a primi accesul în NGO Hub.',
      subtitle: () =>
        `Solicitarea de a crea un cont pentru organizația ta în NGO Hub a fost trimisă cu succes. Echipa NGO Hub va verifica informațiile primite și imediat ce este aprobată vei primi o notificare cu detalii despre accesarea ecosistemului de soluții NGO Hub. Dacă ai întrebări, ne poți contacta la ${process.env.MAIL_CONTACT}`,
    },
  },
  ORGANIZATION_CREATE_SUPERADMIN: {
    template: ORGANIZATION_REQUEST,
    subject: 'Solicitare creare cont organizație',
    context: {
      title: 'O nouă organizație a solicitat acces în NGO Hub',
      subtitle: () =>
        'O nouă solicitare de creare de profil în NGO Hub a fost creată în sistem.',
      cta: {
        link: (requestId) =>
          `${process.env.ONGHUB_URL}/requests/${requestId}/general`,
        label: 'Vezi solicitare',
      },
    },
  },
  ORGANIZATION_REQUEST_APPROVAL: {
    template: ORGANIZATION_REQUEST,
    subject: 'NGO Hub - Contul organizației a fost activat',
    context: {
      title: 'Felicitări! Contul organizației tale a fost activat',
      subtitle: () =>
        `Profilul organizației a fost creat cu succes în NGO Hub. De acum poți intra în cont și poți accesa toate aplicațiile disponibile pro-bono în ecosistemul dedicat societății civile. Dacă ai nevoie de ajutor, ne găsești la ${process.env.MAIL_CONTACT}.`,
      cta: {
        link: () => `${process.env.ONGHUB_URL}/`,
        label: 'Acceseaza NGO Hub',
      },
    },
  },
  ORGANIZATION_REQUEST_REJECTION: {
    template: ORGANIZATION_REQUEST,
    subject: 'NGO Hub - Solicitare respinsă',
    context: {
      title: 'Solicitare respinsă',
      subtitle: () =>
        `Ne pare rău, însă cererea ta de create a contului în NGO Hub a fost respinsă. Pentru mai multe detalii te rugăm să ne scrii la adresa ${process.env.MAIL_CONTACT}.`,
    },
  },
  ORGANIZATION_RESTRICT_ADMIN: {
    template: ORGANIZATION_REQUEST,
    subject: 'NGO Hub - Închidere cont organizație',
    context: {
      title: 'Închidere cont NGO Hub',
      subtitle: (organizationName) =>
        `Contul din NGO Hub al organizației ${organizationName} a fost închis de către super-admin. Pentru mai multe detalii te rugăm să ne scrii la adresa ${process.env.MAIL_CONTACT}`,
    },
  },
  ORGANIZATION_RESTRICT_SUPERADMIN: {
    template: ORGANIZATION_REQUEST,
    subject: 'Solicitare închidere cont organizație',
    context: {
      title: 'O organizație a solicitat închiderea contului NGO Hub',
      subtitle: (organizationName) =>
        `Administratorul organizației ${organizationName} dorește ștergerea organizației sale.`,
    },
  },
  ORGANIZATION_APPLICATION_REQUEST_DELETE: {
    template: ORGANIZATION_REQUEST,
    subject: 'Solicitare ștergere aplicație din contul organizației',
    context: {
      title: 'O organizație a solicitat ștergerea unei aplicații',
      subtitle: (organizationName, applicationName) =>
        `Administratorul organizației ${organizationName} dorește ștergerea aplicației ${applicationName} din organizația sa.`,
      cta: {
        link: (organizationId) =>
          `${process.env.ONGHUB_URL}/organizations/${organizationId}/applications`,
        label: 'Vezi cererea',
      },
    },
  },
  APPLICATION_REQUEST: {
    template: ORGANIZATION_REQUEST,
    subject: '',
    context: {
      title: '',
      subtitle: (organizationName, applicationName) =>
        `O nouă cerere de instalare a aplicației ${applicationName} a fost creată în ONG Hub pentru organizația ${organizationName}.`,
      cta: {
        link: () => `${process.env.ONGHUB_URL}/applications/requests`,
        label: 'Vezi cererea',
      },
    },
  },
  REMIND_TO_UPDATE_ORGANIZATION_REPORTS: {
    template: ORGANIZATION_REQUEST,
    subject:
      'Actualizați profilul organizației până pe 30 iunie pentru a evita suspendarea contului',
    context: {
      title:
        'Actualizați profilul organizației până pe 30 iunie pentru a evita suspendarea contului',
      subtitle: () => `
          <p>Bună,</p>

          <p>Ne bucurăm că ești parte din comunitatea NGO Hub!</p>

          <p>Vrem să îți reamintim că este important să îți actualizezi datele din profilul tău din NGO Hub până la data de <b>30 iunie ${new Date().getFullYear()}</b>.</p>

          <p>Dacă nu reușești să faci această actualizare până la termenul limită, contul tău va fi suspendat temporar.</p>

          <p>Aceștia sunt pașii pe care trebuie să îi urmezi pentru actualizare:</p>

          <ol>
              <li>Conectează-te la contul tău NGO Hub</li>
              <li>Mergi la secțiunea „Organizația mea"</li>
              <li>Verifică și actualizează toate informațiile din secțiunea „Informații financiare" și „ONG-ul în numere".</li>
              <li>Salvează modificările</li>
          </ol>

          <p>Dacă ai nevoie de ajutor sau ai orice fel de întrebare, ne poți contacta oricând la <a href="mailto:civic@code4.ro">civic@code4.ro</a> sau poți programa o sesiune Civic Tech 911 direct din contul NGO Hub al organizației.</p>
      `,
      cta: {
        link: () => `${process.env.ONGHUB_URL}/organization`,
        label: 'Intra in cont',
      },
    },
  },
  WEEKLY_REMINDER_TO_UPDATE_ORGANIZATION_REPORTS: {
    template: ORGANIZATION_REQUEST,
    subject:
      'Actualizați profilul organizației până pe 30 iunie pentru a evita suspendarea contului',
    context: {
      title:
        'Actualizați profilul organizației până pe 30 iunie pentru a evita suspendarea contului',
      subtitle: () => `
          <p>Bună,</p>

          <p>Ne bucurăm că ești parte din comunitatea NGO Hub!</p>

          <p>Îți reamintim că termenul limită pentru actualizarea datelor din profilul tău este 30 iunie ${new Date().getFullYear()}. Pentru a-ți păstra contul activ, te rugăm să îți actualizezi informațiile cât mai curând posibil.</p>

          <p>Aceștia sunt pașii pe care trebuie să îi urmezi pentru actualizare:</p>

          <ol>
              <li>Conectează-te la contul tău NGO Hub</li>
              <li>Mergi la secțiunea „Organizația mea"</li>
              <li>Verifică și actualizează toate informațiile din secțiunea „Informații financiare" și „ONG-ul în numere".</li>
              <li>Salvează modificările</li>
          </ol>

          <p>Dacă ai nevoie de ajutor sau ai orice fel de întrebare, ne poți contacta oricând la <a href="mailto:civic@code4.ro">civic@code4.ro</a> sau poți programa o sesiune Civic Tech 911 direct din contul NGO Hub al organizației.</p>
      `,
      cta: {
        link: () => `${process.env.ONGHUB_URL}/organization`,
        label: 'Intra in cont',
      },
    },
  },
  NOTIFY_FOR_UNAVAILABLE_OR_INVALID_FINANCIAL_INFORMATION: {
    template: ORGANIZATION_REQUEST,
    subject:
      'Acțiune necesară: Te rugăm să corectezi datele din profilul organizației din NGO Hub',
    context: {
      title:
        'Acțiune necesară: Te rugăm să corectezi datele din profilul organizației din NGO Hub',
      subtitle: () => `
          <p>Bună,</p>

          <p>Ne bucurăm că ești parte din comunitatea NGO Hub!</p>

          <p>Am observat că unele dintre informațiile recent actualizate din profilul tău de pe NGO Hub par a fi invalide sau incomplete. Pentru a ne asigura că ai acces neîntrerupt la contul tău, te rugăm să îți actualizezi și corectezi datele cât mai curând posibil.</p>

          <p>Aceștia sunt pașii pe care trebuie să îi urmezi pentru actualizare:</p>

          <ol>
              <li>Conectează-te la contul tău NGO Hub</li>
              <li>Mergi la secțiunea „Organizația mea"</li>
              <li>Verifică și actualizează toate informațiile din secțiunea „Informații financiare" și „ONG-ul în numere".</li>
              <li>Salvează modificările</li>
          </ol>

          <p>Este important să faci aceste actualizări înainte de <b>30 iunie 2024</b> pentru a evita suspendarea contului tău NGO Hub.</p>

          <p>Dacă ai nevoie de ajutor sau ai orice fel de întrebare, ne poți contacta oricând la <a href="mailto:civic@code4.ro">civic@code4.ro</a> sau poți programa o sesiune Civic Tech 911 direct din contul NGO Hub al organizației.</p>
      `,
      cta: {
        link: () => `${process.env.ONGHUB_URL}/organization`,
        label: 'Intra in cont',
      },
    },
  },
};
