import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as dotenv from 'dotenv';
import { scrubBreadcrumb, scrubEvent } from './common/helpers/sentry-scrub';
dotenv.config();

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],

  environment: process.env.NODE_ENV,

  // Add Tracing by setting tracesSampleRate
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,

  // Set sampling rate for profiling
  // This is relative to tracesSampleRate
  profilesSampleRate: 1.0,

  // Login secrets (links, codes, OIDC code/state, tokens, cookies) never leave for Sentry.
  sendDefaultPii: false,
  beforeSend: (event) => scrubEvent(event),
  beforeSendTransaction: (event) => scrubEvent(event),
  beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
});
