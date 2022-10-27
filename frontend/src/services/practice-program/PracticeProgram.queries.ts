import { useMutation, useQuery } from 'react-query';
import { PracticeProgramPayload } from './interfaces/practice-program-payload.interface';
import {
  createPracticeProgram,
  deletePracticeProgram,
  getPracticeProgramById,
  getPracticePrograms,
  updatePracticeProgram,
} from './PracticeProgram.service';

export const useGetPracticeProgramQuery = (practiceProgramId: string) => {
  return useQuery(
    ['practice-program', practiceProgramId],
    () => getPracticeProgramById(practiceProgramId),
    {
      enabled: !!practiceProgramId,
    },
  );
};

export const useCreatePracticeProgramMutation = () => {
  return useMutation((createPracticeProgramPayload: PracticeProgramPayload) =>
    createPracticeProgram(createPracticeProgramPayload),
  );
};

export const useEditPracticeProgramMutation = () => {
  return useMutation(({ id, data }: { id: string; data: Partial<PracticeProgramPayload> }) =>
    updatePracticeProgram(id, data),
  );
};

export const useDeletePracticeProgramMutation = () => {
  return useMutation((id: number) => deletePracticeProgram(id));
};

export const usePracticePrograms = () => {
  return useQuery(['practice-programs'], () => getPracticePrograms());
};
