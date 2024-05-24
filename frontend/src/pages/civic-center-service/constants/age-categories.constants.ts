import i18n from '../../../common/config/i18n';
import { Beneficiary } from '../../../common/enums/age-category.enum';

export const ageCategories = Object.keys(Beneficiary).map((key) => {
  return {
    name: i18n.t(`beneficiaries.${key}`, { ns: 'civic_center_service' }),
    id: key,
  };
});
