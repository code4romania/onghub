import { useMutation } from 'react-query';
import { createApplication } from './Application.service';
import { CreateApplicationDto } from './interfaces/Application.dto';

export const useCreateApplicationMutation = (onSuccess?: any, onError?: any) => {
  return useMutation((applicationDto: CreateApplicationDto) => createApplication(applicationDto), {
    onSuccess,
    onError,
  });
};
