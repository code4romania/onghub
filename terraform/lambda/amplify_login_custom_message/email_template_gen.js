const TOP = `
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
        @font-face {
            font-family: 'Titillium Web';
            font-style: normal;
            font-weight: 400;
            src: url(https://fonts.gstatic.com/s/titilliumweb/v15/NaPecZTIAOhVxoMyOr9n_E7fdMPmDaZRbrw.woff2) format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
                U+2212, U+2215, U+FEFF, U+FFFD;
        }
    </style>
</head>

<body style="
      font-family: 'Titillium Web', sans-serif !important;
      font-size: 16px !important;
      margin: 0 !important;
    ">
    <div style="
        background-color: #ffffff;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
      ">
        <div>
            <img src="https://onghub-dev-files.s3.eu-central-1.amazonaws.com/public/header.png" style="width: 100%" />
        </div>
`

const BOTTOM = `
<div style="
background-color: #000000;
color: #ffffff !important;
padding: 1.5rem 5rem;
">
  <table style="width: 80%; border: none; margin-left: auto; margin-right: auto; padding-bottom: 1rem">
      <tr>
          <td>
              <p style="color: #ffffff !important; font-size: 0.75rem">
                  Soluție proiectată, dezvoltată și administrată pro-bono de
              </p>
          </td>
          <td>
              <img class="logo"
                  src="https://onghub-dev-files.s3.eu-central-1.amazonaws.com/public/code4romania_logo.png" />
          </td>
      </tr>
  </table>

  <div style="width: 100%; height: 1px; background: #ffffff"></div>

  <p style="
  text-align: center;
  width: 100%;
  color: #ffffff !important;
  font-size: 0.75rem;
  margin-top: 1.5rem
">
      Dacă vrei să iei legătura cu noi o poți face pe e-mail la adresa:
      <a style="color: #ffffff !important; font-size: 0.75rem;" href="contact@code4.ro">contact@code4.ro</a>
  </p>

  <table style="width: 50%; border: none; margin-left: auto; margin-right: auto; padding-top: 1rem">
      <tr>
          <td>
              <a style="text-decoration: none; color: #1a15ea" href="https://www.facebook.com/code4romania/"
                  target="_blank">
                  <img style="margin: 0 1rem"
                      src="https://onghub-dev-files.s3.eu-central-1.amazonaws.com/public/facebook_logo.png" /></a>
          </td>
          <td>
              <a style="text-decoration: none; color: #1a15ea" href="https://www.instagram.com/code4romania"
                  target="_blank">
                  <img style="margin: 0 1rem"
                      src="https://onghub-dev-files.s3.eu-central-1.amazonaws.com/public/instagram_logo.png" /></a>
          </td>
          <td>
              <a style="text-decoration: none; color: #1a15ea" href="/" target="_blank">
                  <img style="margin: 0 1rem"
                      src="https://onghub-dev-files.s3.eu-central-1.amazonaws.com/public/youtube_logo.png" /></a>
          </td>
          <td>
              <a style="text-decoration: none; color: #1a15ea" href="https://github.com/code4romania/"
                  target="_blank">
                  <img style="margin: 0 1rem"
                      src="https://onghub-dev-files.s3.eu-central-1.amazonaws.com/public/github_logo.png" /></a>
          </td>
      </tr>
  </table>
  <p style="text-align: center; color: #6b7280; font-size: 0.75rem">
      © 2020 Code4Romania. All rights reserved.
  </p>
</div>
</div>
</body>
`

const FORGOT_PASSWORD_CONTENT = (codeParameter) => `
        ${TOP}
        <div id="content" style="padding: 1rem 5rem 3rem 5rem">
            <h1 style="margin-bottom: 1.5rem; color: #000000 !important">Codul tău de verificare</h1>
            <p style="font-size: 1rem; line-height: 1.5rem; color: #000000 !important">
                Bună,<br /><br />
                Codul tău de verificare este
                <strong>${codeParameter}</strong>.
            </p>
            <p style="font-size: 1rem; line-height: 1.5rem; color: #000000 !important">
                Dacă întâmpini vreo problemă ne poți transmite un email pe adresa
                <a style="text-decoration: none; color: #1a15ea; font-size: 1rem; line-height: 1.5rem;"
                    href="mailto:contact@onghub.ro">contact@onghub.ro</a>.
            </p>
        </div>
        ${BOTTOM}
`

const USER_INVITE_CONTENT = (username, tempPassword, inviteLink) => `
        ${TOP}
        <div style="padding: 1rem 5rem 3rem 5rem">
            <h1 style="margin-bottom: 1.5rem; color: #000000 !important">
                Parola ta temporară
            </h1>
            <p style="font-size: 1rem; line-height: 1.5rem; color: #000000 !important">
                Bună,<br /><br />
                Contul tău de NGO Hub a fost creat cu success. Pentru a te loga în
                aplicație te rugăm să accesezi ONGHub apasand butonul de mai jos si sa folosești urmatoarele credențialele temporare:<br /><br />Username:
                <strong>${username}</strong><br />Parola temporară:
                <strong>${tempPassword}</strong>
            </p>
            <p style="font-size: 1rem; line-height: 1.5rem; color: #000000 !important">
                Nu uita să îți schimbi parola unică pentru a accesa ecosistemul dedicat
                societății civile creat de Code for Romania. Dacă întâmpini vreo
                problemă ne poți transmite un email pe adresa
                <a style="
              text-decoration: none;
              color: #1a15ea;
              font-size: 1rem;
              line-height: 1.5rem;
            " href="mailto:contact@onghub.ro">contact@onghub.ro</a>.
            </p>
            <a href="${inviteLink}" target="_blank">
                <button style="
              min-width: fit-content;
              padding: 10px 17px;
              color: #000000;
              background-color: #fff649;
              width: 8rem;
              height: 2.5rem;
              border-radius: 6px;
              border-width: 0;
              cursor: pointer;
            " type="button">
                    Acceseaza ONGHub
                </button>
            </a>
        </div>
        ${BOTTOM}
`

module.exports = {
    getForgotPasswordEmailTemplate: FORGOT_PASSWORD_CONTENT,
    getForgotPasswordEmailTitle: () => 'Codul tău de verificare',
    getInviteUserEmailTemplate: USER_INVITE_CONTENT,
    getInviteUserEmailTitle: (username) => 'Bun venit in ONGHub!'
}
