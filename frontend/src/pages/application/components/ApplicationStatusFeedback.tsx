import React from 'react';

interface ApplicationStatusFeedbackProps {
  children: string;
}

const ApplicationStatusFeedback = ({ children }: ApplicationStatusFeedbackProps) => (
  <div className="flex pt-4 gap-4 items-center justify-center">
    <p className="text-gray-700 font-titilliumBold sm:text-sm lg:text-base text-xs">{children}</p>
  </div>
);

export default ApplicationStatusFeedback;
