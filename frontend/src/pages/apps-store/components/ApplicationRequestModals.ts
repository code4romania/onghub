import i18n from '../../../common/config/i18n';

const translations = {
  back: i18n.t('common:back'),
  approve: {
    title: i18n.t('appstore:request_modal.approve.title'),
    description: i18n.t('appstore:request_modal.approve.description'),
    confirm: i18n.t('appstore:request_modal.approve.confirm'),
  },
  reject: {
    title: i18n.t('appstore:request_modal.reject.title'),
    description: i18n.t('appstore:request_modal.reject.description'),
    confirm: i18n.t('appstore:request_modal.reject.confirm'),
  },
};

export const APPROVE_APPLICATION_MODAL_CONFIG = {
  title: translations.approve.title,
  description: translations.approve.description,
  closeBtnLabel: translations.back,
  confirmBtnLabel: translations.approve.confirm,
  confirmButtonStyle: 'save-button',
};

export const REJECT_APPLICATION_MODAL_CONFIG = {
  title: translations.reject.title,
  description: translations.reject.description,
  closeBtnLabel: translations.back,
  confirmBtnLabel: translations.reject.confirm,
};
