import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

interface FeedbackViewModalProps {
  onClose: () => void;
  serviceName?: string;
  fullName?: string;
  rating?: number;
  interactionDate?: string;
  message?: string;
  createdOn?: string;
}

const FeedbackViewModal = ({
  serviceName,
  fullName,
  rating,
  interactionDate,
  message,
  createdOn,
  onClose,
}: FeedbackViewModalProps) => {
  const { t } = useTranslation('feedback');

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full w-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl md:max-w-lg lg:max-w-4xl sm:w-full sm:p-10">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <div className="grid grid-cols-2">
                      <Dialog.Title
                        as="h3"
                        className="sm:text-lg lg:text-xl text-md leading-6 font-bold text-gray-900"
                      >
                        {t('view_modal.details')}
                      </Dialog.Title>
                      <button className="right-5 fixed w-min" onClick={onClose}>
                        <XIcon className="mx-auto sm:h-5 sm:w-5 h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-6">
                      <p className="text-gray-400 lg:pt-6 pt-3 sm:text-sm lg:text-base text-xs">
                        {t('header.service_name')}
                      </p>
                      <p className="sm:text-sm lg:text-base text-xs text-gray-900 font-normal">
                        {serviceName}
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="text-gray-400 lg:pt-6 pt-3 sm:text-sm lg:text-base text-xs">
                        {t('view_modal.author_name')}
                      </p>
                      <p className="sm:text-sm lg:text-base text-xs text-gray-900 font-normal">
                        {fullName}
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="text-gray-400 lg:pt-6 pt-3 sm:text-sm lg:text-base text-xs">
                        {t('header.rating')}
                      </p>
                      <p className="sm:text-sm lg:text-base text-xs text-gray-900 font-normal">
                        {`${rating} / 5`}
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="text-gray-400 lg:pt-6 pt-3 sm:text-sm lg:text-base text-xs">
                        {t('view_modal.interaction_when')}
                      </p>
                      <p className="sm:text-sm lg:text-base text-xs text-gray-900 font-normal">
                        {interactionDate}
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="text-gray-400 lg:pt-6 pt-3 sm:text-sm lg:text-base text-xs ">
                        {t('view_modal.interaction_how')}
                      </p>
                      <p className="sm:text-sm lg:text-base text-xs text-gray-900 font-normal">
                        {message}
                      </p>
                    </div>
                    <div className="mt-6">
                      <p className="text-gray-400 lg:pt-6 pt-3 sm:text-sm lg:text-base text-xs">
                        {t('view_modal.date_added')}
                      </p>
                      <p className="sm:text-sm lg:text-base text-xs text-gray-900 font-normal">
                        {createdOn}
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default FeedbackViewModal;
