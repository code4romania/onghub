import { toast } from 'react-toastify';

const useErrorToast = (message: string, id?: string) => {
  const errorToastId = id || 'errorToast';

  if (toast.isActive(errorToastId)) {
    toast.dismiss(errorToastId);
  }

  toast.error(message, {
    icon: false,
    theme: 'colored',
    toastId: errorToastId,
    hideProgressBar: true,
    autoClose: 3000,
  });
};

const useSuccessToast = (message: string) => {
  const successToastId = 'successToast';

  if (toast.isActive(successToastId)) {
    toast.dismiss(successToastId);
  }

  toast.success(message, {
    icon: false,
    theme: 'colored',
    toastId: successToastId,
    hideProgressBar: true,
    autoClose: 3000,
  });
};

export { useErrorToast, useSuccessToast };
