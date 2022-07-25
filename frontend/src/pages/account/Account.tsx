import { PencilIcon } from '@heroicons/react/outline';
import React from 'react';
import { classNames } from '../../common/helpers/tailwind.helper';

const Account = () => {
  return (
    <div>
      <div className="flex items-start justify-between pt-1 pr-1 pb-6">
        <div className="flex flex-col">
          <p className="text-gray-800 font-titilliumBold text-3xl">Contul meu</p>
          <p className="text-gray-400 pt-6">
            Lore ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa
            aplicațiile disponibile.
          </p>
        </div>
        <button type="button" className="red-button">
          {'Inchide contul'}
        </button>
      </div>
      <div className="w-full bg-white shadow rounded-lg ">
        <div className="py-5 px-10 flex justify-between">
          <span className="font-titilliumBold text-xl text-gray-800">Setari cont</span>
          <button type="button" className={classNames('edit-button')}>
            {'Schimba parola'}
          </button>
        </div>

        <div className="w-full border-t border-gray-300" />
        <div className="p-5 sm:p-10 flex flex-col">
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </span>
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-2">
              <span className="text-gray-700">Nume</span>
              <span className="text-gray-800 font-titilliumBold">Asociatia ZEN (Admin ONG)</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-700">E-mail cont</span>
              <span className="text-gray-800 font-titilliumBold">adminong@ong.ro</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-700">Parola</span>
              <span className="text-gray-800 font-titilliumBold">*******</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
