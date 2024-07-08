import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import i18n from '../../../common/config/i18n';
import { CREATE_FLOW_URL } from '../constants/CreateOrganization.constant';

export interface IProgressStep {
  index: number;
  id: string;
  name: string;
  href: string;
  status: PROGRESS_STEP_TYPE;
}

export enum PROGRESS_STEP_TYPE {
  UPCOMING = 'upcoming',
  CURRENT = 'current',
  COMPLETE = 'complete',
}

const translations = {
  steps: {
    first: i18n.t('organization:create.steps.first'),
    second: i18n.t('organization:create.steps.second'),
    third: i18n.t('organization:create.steps.third'),
    fourth: i18n.t('organization:create.steps.fourth'),
    fifth: i18n.t('organization:create.steps.fifth'),
  },
  account: i18n.t('organization:create.steps.account'),
  agreement: i18n.t('organization:create.steps.agreement'),
  general: i18n.t('organization:create.steps.general'),
  activity: i18n.t('organization:create.steps.activity'),
  legal: i18n.t('organization:create.steps.legal'),
};

const steps_seed: IProgressStep[] = [
  {
    index: 0,
    id: translations.steps.first,
    name: translations.agreement,
    href: `/${CREATE_FLOW_URL.BASE}/agreement`,
    status: PROGRESS_STEP_TYPE.CURRENT,
  },
  {
    index: 1,
    id: translations.steps.second,
    name: translations.account,
    href: `/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.ACCOUNT}`,
    status: PROGRESS_STEP_TYPE.CURRENT,
  },
  {
    index: 2,
    id: translations.steps.third,
    name: translations.general,
    href: `/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.GENERAL}`,
    status: PROGRESS_STEP_TYPE.UPCOMING,
  },
  {
    index: 3,
    id: translations.steps.fourth,
    name: translations.activity,
    href: `/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.ACTIVITY}`,
    status: PROGRESS_STEP_TYPE.UPCOMING,
  },
  {
    index: 4,
    id: translations.steps.fifth,
    name: translations.legal,
    href: `/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.LEGAL}`,
    status: PROGRESS_STEP_TYPE.UPCOMING,
  },
];

export default function ProgressSteps({ activeStepIndex, setActiveStepIndex, disabled }: { activeStepIndex: number, setActiveStepIndex: (index: number) => void, disabled: boolean }) {
  const [steps, setSteps] = useState<IProgressStep[]>(steps_seed);
  const location = useLocation();
  const navigate = useNavigate();

  const handlePreviousStepClick = (step: IProgressStep) => {
    if (disabled) return;

    setActiveStepIndex(step.index);
    navigate(step.href);
  };

  const stepsMapper = (steps: IProgressStep[], activeIndex: number) => {
    return steps.map((step, index) => {
      if (index < activeIndex) {
        step.status = PROGRESS_STEP_TYPE.COMPLETE;
      } else if (index === activeIndex) {
        step.status = PROGRESS_STEP_TYPE.CURRENT;
      } else {
        step.status = PROGRESS_STEP_TYPE.UPCOMING;
      }
      return step;
    })
  }

  useEffect(() => {
    setSteps((steps => stepsMapper(steps, activeStepIndex)))
  }, [activeStepIndex]);


  useEffect(() => {
    const currentStepIndex = steps.findIndex(step => step.href === location.pathname);
    setActiveStepIndex(currentStepIndex);
  }, [location]);

  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="space-y-4 md:flex md:space-y-0 md:space-x-8 bg-white rounded-lg shadow p-5 sm:p-10"
      >
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1 cursor-pointer">
            {step.status === PROGRESS_STEP_TYPE.COMPLETE ? (
              <a
                aria-label={`Step ${step.name}`}
                className="group pl-4 py-2 flex flex-col border-l-4 border-indigo-600 hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 select-none"
                onClick={handlePreviousStepClick.bind(null, step)}
              >
                <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase group-hover:text-indigo-800 select-none">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : step.status === PROGRESS_STEP_TYPE.CURRENT ? (
              <a
                aria-label={`Step ${step.name}`}
                className="pl-4 py-2 flex flex-col border-l-4 border-indigo-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 select-none"
                aria-current="step"
              >
                <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase select-none">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                aria-label={`Step ${step.name}`}
                className="group pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4 select-none"
              >
                <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700 select-none">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
