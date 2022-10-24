import { useMutation } from 'react-query';
import { PracticeProgramPayload } from './interfaces/practice-program-payload.interface';
import { createPracticeProgram } from './PracticeProgram.service';

export const useCreatePracticeProgramMutation = () => {
  return useMutation((createPracticeProgramPayload: PracticeProgramPayload) =>
    createPracticeProgram(createPracticeProgramPayload),
  );
};
