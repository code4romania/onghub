import { AxiosResponse } from 'axios';
import API from '../API';
import { PracticeProgramPayload } from './interfaces/practice-program-payload.interface';
import { PracticeProgram } from './interfaces/practice-program.interface';
import { parsePracticaProgramFormDataToPaylod } from './PracticeProgram.helper';

export const createPracticeProgram = (
  practiceProgramPayload: PracticeProgramPayload,
): Promise<PracticeProgram> => {
  return API.post(
    `/practice-program`,
    parsePracticaProgramFormDataToPaylod(practiceProgramPayload),
  ).then((res: AxiosResponse<PracticeProgram>) => res.data);
};

export const updatePracticeProgram = (
  id: string,
  practiceProgramPayload: Partial<PracticeProgramPayload>,
): Promise<PracticeProgram> => {
  return API.patch(
    `/practice-program/${id}`,
    parsePracticaProgramFormDataToPaylod(practiceProgramPayload),
  ).then((res: AxiosResponse<PracticeProgram>) => res.data);
};

export const getPracticeProgramById = (id: string): Promise<PracticeProgram> => {
  return API.get(`/practice-program/${id}`).then((res: AxiosResponse<PracticeProgram>) => res.data);
};
