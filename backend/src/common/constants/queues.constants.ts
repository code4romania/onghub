export const QUEUES = {
  MAILS: 'mails',
  // Transition emails from auth:migrate, held (paused) until auth:release-transition.
  // Suffixed: Redis is shared with VIC, whose queue is auth-transition-vic.
  AUTH_TRANSITION: 'auth-transition-ngohub',
};
