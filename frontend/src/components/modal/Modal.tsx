import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ children, title, onClose }: ModalProps) => {
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
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex gap-[18px] flex-col bg-white rounded-lg p-6 text-left overflow-hidden shadow-section transform transition-all sm:max-w-lg sm:w-full">
                <div className="flex justify-between items-center text-center sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="sm:text-lg lg:text-xl leading-6 font-robotoBold line-clamp-2"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    className="bg-white rounded-md text-cool-gray-900 hover:text-cool-gray-500 focus:outline-none focus:shadow-blue"
                    onClick={onClose}
                    aria-label="close-modal"
                    type="button"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
