import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { CheckCircleIcon } from '@heroicons/react/solid';
import ProgressSteps from './components/ProgressSteps';
import { ICreateOrganizationPayload } from './interfaces/CreateOrganization.interface';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { createOrganization } from '../../services/organization/Organization.service';
import { mapSelectToValue } from '../../common/helpers/format.helper';
import { createOrganizationDTOMapper } from './helper/CreateOrganization.helper';

const CreateOrganization = () => {
  const [organization, setOrganization] = useState<ICreateOrganizationPayload>({
    user: null,
    general: null,
    activity: null,
    legal: null,
  });

  const [finished, setFinished] = useState(false);

  useCountiesQuery();

  useEffect(() => {
    if (
      organization &&
      organization.user &&
      organization.general &&
      organization.activity &&
      organization.legal
    ) {
      setFinished(false);
      const dto = createOrganizationDTOMapper(organization);
      createOrganization({
        ...dto,
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }, [organization]);

  return (
    <div className="w-screen h-screen max-w-full ">
      <Header />
      <div className="flex p-6">
        <div className="content overflow-scroll w-full pl-6 flex flex-col gap-4">
          <ProgressSteps disabled={finished} />
          {!finished && <Outlet context={[organization, setOrganization]} />}
          {finished && (
            <div className="bg-white rounded-lg shadow p-5 sm:p-10 m-1">
              <div className="flex items-center justify-start pb-6 gap-4">
                <CheckCircleIcon className="fill-green w-8 h-8" />
                <span className="font-titilliumBold text-3xl">Felicitari!</span>
              </div>
              <p className="leading-6">
                Ai completat cu succes formularul de aplicare pentru ONG Hub. Pe adresa de e-mail
                indicată, ai primit confirmarea aplicării și o copie a formularului completat. Te
                vom contacta în cel mai scurt timp pentru a continua procesul de implementare al ONG
                Hub pentru organizația ta.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
