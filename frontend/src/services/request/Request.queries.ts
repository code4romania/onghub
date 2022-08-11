import { useMutation } from 'react-query';
import { CreateRequestDTO } from './interfaces/Request.dto';
import { createRequest } from './Request.service';

export const useCreateRequestMutation = (onSuccess?: any, onError?: any) => {
  return useMutation((request: CreateRequestDTO) => createRequest(request), { onSuccess, onError });
};
