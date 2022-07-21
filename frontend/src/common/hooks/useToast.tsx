import { toast } from 'react-toastify';

const useErrorToast = (message: string) => {
  const errorToastId = 'errorToast';

  if (toast.isActive(errorToastId)) {
    toast.dismiss(errorToastId);
  }

  toast.error(message, {
    icon: false,
    theme: 'colored',
    toastId: errorToastId,
    hideProgressBar: true,
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
  });
};

export { useErrorToast, useSuccessToast };
