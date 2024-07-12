import React from 'react';
import { classNames } from '../../common/helpers/tailwind.helper';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './PhoneNumberInput.css';
import { PhoneNumberInputConfig } from './PhoneNumberInput.interface';


const PhoneNumberInput = (props: {
    config: Partial<PhoneNumberInputConfig>;
    readonly?: boolean;
    link?: boolean;
    hidden?: boolean;
    disabled?: boolean;
    alwaysShowHelper?: boolean;
}) => {

    return (
        <div className={classNames('relative w-full', props.hidden ? 'hidden' : '')}>
            {props.config.label && (
                <label
                    htmlFor={`${props.config.id}__input`}
                    className="block sm:text-sm lg:text-base text-xs font-medium text-gray-700"
                >
                    {props.config.label}
                </label>
            )}

            <div className="mt-1 relative rounded-md">
                {props.readonly && !props.link && (
                    <span className="break-word">{props.config.defaultValue || '-'}</span>
                )}
                {!props.readonly && (
                    <>
                        <PhoneInput
                            className={props.config.error && 'error'}
                            value={props.config.defaultValue}
                            onChange={props.config.onChange}
                            defaultCountry={'RO'}
                            countryCallingCodeEditable={false}

                        />
                    </>
                )}
                {props.config.error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                )}
            </div>
            {!props.config.error && (!props.readonly || props.alwaysShowHelper) && (
                <p className="mt-1 sm:text-sm text-xs text-gray-500 font-normal" id="email-description">
                    {props.config.helperText}
                </p>
            )}
            {props.config.error && (
                <p
                    className="mt-1 sm:text-sm text-xs text-red-600 whitespace-pre-wrap"
                    id={`${props.config.id}__input-error`}
                >
                    {props.config.error}
                </p>
            )}
        </div>
    );
};

export default PhoneNumberInput;
