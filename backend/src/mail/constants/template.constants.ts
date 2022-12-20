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
    subject: 'Creare Organizatie',
    context: {
      title:
        'Felicitari! Esti cu un pas mai aproape de a avea acces in ONGHub.',
      subtitle: () =>
        `Solicitarea de a crea un cont in ONG Hub pentru organizatia ta a fost trimisa cu succes. Echipa ONG Hub va verifica informatiile primite si imediat ce este aprobata vei primi o notificare cu detalii despre accesarea ecosistemului de solutii ONG Hub. Daca ai intrebari, ne poti contacta la ${process.env.MAIL_CONTACT}`,
    },
  },
  ORGANIZATION_CREATE_SUPERADMIN: {
    template: ORGANIZATION_REQUEST,
    subject: 'Creare Organizatie',
    context: {
      title: 'Creare Organizatie - Solicitare noua',
      subtitle: () =>
        'O noua solicitare de creare de profil in ONG Hub a fost creata in sistem.',
      cta: {
        link: (requestId) =>
          `${process.env.ONGHUB_URL}/requests/${requestId}/general`,
        label: 'Solicitare creare',
      },
    },
  },
  ORGANIZATION_REQUEST_APPROVAL: {
    template: ORGANIZATION_REQUEST,
    subject: 'Creare Organizatie',
    context: {
      title: 'Creare Organizatie - Solicitare aprobata',
      subtitle: () =>
        `Profilul tau ONG Hub a fost creat cu succes. Incepand de acum vei putea intra in cont si vei avea acces la toate aplicatiile disponibile pro-bono in ecosistemul dedicat societatii civile. Daca ai nevoie de ajutor, ne gasesti la ${process.env.MAIL_CONTACT}.`,
      cta: {
        link: () => `${process.env.ONGHUB_URL}/`,
        label: 'Organizatia ta',
      },
    },
  },
  ORGANIZATION_REQUEST_REJECTION: {
    template: ORGANIZATION_REQUEST,
    subject: 'Creare Orgnizatie',
    context: {
      title: 'Creare Organizatie - Solicitare respinsa',
      subtitle: () =>
        `Solicitarea ta de a crea un profil in ONG Hub a fost respinsa. Pentru mai multe detalii te rugam sa ne scrii la adresa ${process.env.MAIL_CONTACT}.`,
    },
  },
  ORGANIZATION_RESTRICT_ADMIN: {
    template: ORGANIZATION_REQUEST,
    subject: 'Inchidere Organizatie',
    context: {
      title: 'Inchidere Organizatie',
      subtitle: (organizationName) =>
        `Contul organizatiei ${organizationName} a fost inchis de catre super-admin. Pentru mai multe informatii trimite un mail catre ${process.env.MAIL_CONTACT}`,
    },
  },
  ORGANIZATION_RESTRICT_SUPERADMIN: {
    template: ORGANIZATION_REQUEST,
    subject: 'Inchidere Organizatie',
    context: {
      title: 'Inchidere Organizatie - Solicitare noua',
      subtitle: (organizationName) =>
        `Administratorul organizatiei ${organizationName} doreste stergerea organizatiei sale.`,
    },
  },
  ORGANIZATION_APPLICATION_REQUEST_DELETE: {
    template: ORGANIZATION_REQUEST,
    subject: 'Stergere aplicatie din organizatie',
    context: {
      title: 'Stergere aplicatie din organizatie - Solicitare noua',
      subtitle: (organizationName, applicationName) =>
        `Administratorul organizatiei ${organizationName} doreste stergerea aplicatiei ${applicationName} din organizatia sa.`,
      cta: {
        link: (organizationId) =>
          `${process.env.ONGHUB_URL}/organizations/${organizationId}/applications`,
        label: 'Organizatia',
      },
    },
  },
};
