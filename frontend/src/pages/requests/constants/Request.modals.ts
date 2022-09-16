import i18n from '../../../common/config/i18n';

const translations = {
  approve: {
    title: i18n.t('requests:modals.approve.title'),
    description: i18n.t('requests:modals.approve.description'),
    confirm: i18n.t('requests:modals.approve.description'),
  },
  reject: {
    title: i18n.t('requests:modals.reject.title'),
    description: i18n.t('requests:modals.reject.description'),
    confirm: i18n.t('requests:modals.reject.description'),
  },
  back: i18n.t('common:back'),
};

export const APPROVE_MODAL_CONFIG = {
  title: translations.approve.title,
  description: translations.approve.description,
  closeBtnLabel: translations.back,
  confirmBtnLabel: translations.approve.confirm,
  confirmButtonStyle: 'save-button',
};

export const REJECT_MODAL_CONFIG = {
  title: translations.reject.title,
  description: translations.reject.description,
  closeBtnLabel: translations.back,
  confirmBtnLabel: translations.reject.confirm,
};
