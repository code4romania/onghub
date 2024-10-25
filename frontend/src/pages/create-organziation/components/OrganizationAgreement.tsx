import React, { useEffect } from 'react';
import SectionHeader from '../../../components/section-header/SectionHeader';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from '../../../common/helpers/tailwind.helper';
import {
  CREATE_FLOW_URL,
  ORGANIZATION_AGREEMENT_KEY,
} from '../constants/CreateOrganization.constant';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { updateActiveStepIndexInLocalStorage } from '../../../common/helpers/utils.helper';

const OrganizationAgreement = () => {
  const { t } = useTranslation('organization');

  const navigate = useNavigate();

  const [, , , , , , activeStepIndex, setActiveStepIndex] = useOutletContext<any>();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    const initialCheck = localStorage.getItem(ORGANIZATION_AGREEMENT_KEY);
    reset({ agreement: initialCheck === 'true' });
  }, []);

  const handleSave = async () => {
    navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.ACCOUNT}`);
    updateActiveStepIndexInLocalStorage(activeStepIndex, 1, setActiveStepIndex);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg m-1">
      <div className="w-full " />
      <div className="p-5 sm:p-10 flex flex-col">
        <div className="flex flex-col gap-4 w-full">
          <SectionHeader title={t('create.user_agreement.title')} />
          <ol className="list-decimal pl-4">
            <li>{t('create.user_agreement.list_item_1')}</li>
            <li>{t('create.user_agreement.list_item_2')}</li>
            <li>{t('create.user_agreement.list_item_3')}</li>
            <li>
              {t('create.user_agreement.list_item_4.part_1')}
              <a
                className="text-blue-500"
                target="_blank"
                href="https://www.code4.ro/ro/codul-de-conduita"
                rel="noreferrer"
              >
                {t('create.user_agreement.list_item_4.code_of_conduct')}
              </a>{' '}
              {t('create.user_agreement.list_item_4.part_2')}
              <a
                target="_blank"
                className="text-blue-500"
                href="https://www.code4.ro/ro/politica-peas"
                rel="noreferrer"
              >
                {t('create.user_agreement.list_item_4.peas_policy')}
              </a>
              ;
            </li>
            <li>{t('create.user_agreement.list_item_5')}</li>
            <li>{t('create.user_agreement.list_item_6')}</li>
            <li>{t('create.user_agreement.list_item_7')}</li>
          </ol>
          <p>{t('create.user_agreement.paragraph')}</p>
          <p>
            {t('create.user_agreement.support_paragraph')}
            <a className="text-blue-500" href="mailto:civic@code4.ro">
              civic@code4.ro"
            </a>
          </p>
          <form className="flex flex-row gap-2 items-center">
            <Controller
              key="agreement"
              name="agreement"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: t('create.user_agreement.form.agreement.required'),
                },
              }}
              render={({ field: { onChange, value } }) => {
                return (
                  <input
                    value={value}
                    type="checkbox"
                    name="agreement"
                    onChange={(event) => {
                      localStorage.setItem(
                        ORGANIZATION_AGREEMENT_KEY,
                        event.target.checked.toString(),
                      );
                      onChange(event);
                    }}
                    checked={value}
                    id={`agreement`}
                  />
                );
              }}
            />

            {t('create.user_agreement.terms_and_agreement_paragraph')}
          </form>
          {!isValid && isSubmitted && (
            <p
              className="mt-[-0.5rem] sm:text-sm text-xs text-red-600 whitespace-pre-wrap"
              id={`agreement-error`}
            >
              <>{errors?.agreement?.message || ''}</>
            </p>
          )}
        </div>
        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
          <button
            aria-label={t('next', { ns: 'common' })}
            id="create-organization-account__button-next"
            type="button"
            className={classNames(
              'bg-yellow-600 focus:ring-yellow-500 hover:bg-yellow-700',
              'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2  sm:text-sm lg:text-base text-xs font-medium text-black  focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto',
            )}
            onClick={handleSubmit(handleSave)}
          >
            {t('next', { ns: 'common' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationAgreement;
