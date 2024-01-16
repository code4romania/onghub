import React from 'react';
import Modal from '../modal/Modal';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import i18n from '../../common/config/i18n';
import InputField from '../InputField/InputField';
import { useTranslation } from 'react-i18next';

interface AddCoFedModalProps {
  title: string;
  description: string;
  onClose: () => void;
  onSubmit: (coFed: CoFedFormTypes) => void;
}

export type CoFedFormTypes = {
  name: string;
};

const schema = yup
  .object({
    name: yup
      .string()
      .required(`${i18n.t('activity:config.add_federation_modal.form.name.required')}`),
  })
  .required();

const AddCoFedModal = ({ title, description, onClose, onSubmit }: AddCoFedModalProps) => {
  const { t } = useTranslation('activity');

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CoFedFormTypes>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-gray-900">{description}</p>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          key="name"
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <InputField
                config={{
                  type: 'text',
                  label: `${t('config.add_federation_modal.form.name.label')}`,
                  name: 'name',
                  placeholder: `${t('config.add_federation_modal.form.name.placeholder')}`,
                  error: errors['name']?.message,
                  onChange,
                  id: 'name',
                  defaultValue: value,
                }}
              />
            );
          }}
        />
      </form>
      <div className="flex flex-row-reverse">
        <button className="save-button" onClick={handleSubmit(onSubmit)}>
          {t('config.add_federation_modal.form.name.submit')}
        </button>
      </div>
    </Modal>
  );
};

export default AddCoFedModal;
