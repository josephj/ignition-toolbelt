import React, { useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
  VStack,
  FormControl,
  FormLabel,
  Select,
  Button,
  useBoolean,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { devClient, signIn } from './util';
import MUTATION_CREATE_ACCOUNT_WITH_PAYMENTS from '../../../graphql/dev_api/mutation.seedWithPayments.graphql';

const CREATE_PAYMENT_PRACTICE_FORM_VALUES =
  'create-payment-practice-form-values';
const DEFAULT_VALUES = {
  countryCode: 'au',
  featureFlags: [],
  paymentsTraits: [
    'collected',
    'collection_scheduled',
    'disbursing_next',
    'cancelled',
    'with_failed_collection',
    'disbursed',
    'clawed_back',
  ],
};

const AVAILABLE_PAYMENTS_TRAITS = [
  'cancelled',
  'clawed_back',
  'clawing_back',
  'collected',
  'collecting',
  'collection_scheduled',
  'disbursed',
  'disbursing',
  'disbursing_next',
  'refund_scheduled',
  'refunding',
  'uncollected',
  'with_approved_refund',
  'with_authentication_required_collection',
  'with_completed_clawback',
  'with_completed_collection',
  'with_completed_deployment',
  'with_completed_disbursal',
  'with_completed_refund',
  'with_failed_clawback',
  'with_failed_collection',
  'with_failed_disbursal',
  'with_failed_refund',
  'with_lost_dispute',
  'with_started_clawback',
  'with_started_collection',
  'with_started_disbursal',
  'with_started_dispute',
  'with_started_refund',
  'with_won_dispute',
] as const;

type PaymentsTrait = (typeof AVAILABLE_PAYMENTS_TRAITS)[number];

type FormValues = {
  name: string;
  countryCode: string;
  featureFlags: string[];
  paymentsTraits: PaymentsTrait[];
};

export const CreatePaymentPractice = () => {
  const [isProcessing, setProcessing] = useBoolean();
  const { control, register, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      countryCode: 'au',
      featureFlags: [],
      paymentsTraits: [
        'collected',
        'collection_scheduled',
        'disbursing_next',
        'cancelled',
        'with_failed_collection',
        'disbursed',
        'clawed_back',
      ],
    },
  });

  useEffect(() => {
    chrome.storage.local
      .get([CREATE_PAYMENT_PRACTICE_FORM_VALUES])
      .then((results) => {
        const cache =
          results[CREATE_PAYMENT_PRACTICE_FORM_VALUES] || DEFAULT_VALUES;
        reset(cache);
      });
  }, [reset]);

  const handleCreate = async (formValues: FormValues) => {
    const { countryCode, featureFlags, paymentsTraits } = formValues;
    setProcessing.on();
    const { data } = await devClient.mutate({
      mutation: MUTATION_CREATE_ACCOUNT_WITH_PAYMENTS,
      variables: { countryCode, featureFlags, paymentsTraits },
    });
    await chrome.storage.local.set({
      [CREATE_PAYMENT_PRACTICE_FORM_VALUES]: formValues,
    });
    const { email } = data.seedPracticeWithPayments.practice.principal;
    await signIn({ email });
    window.location.href = '/settings/payments';
    setProcessing.off();
  };

  return (
    <VStack spacing="large">
      <FormControl>
        <FormLabel>Country</FormLabel>
        <Select {...register('countryCode')}>
          <option value="au">Australia</option>
          <option value="ca">Canada</option>
          <option value="nz">New Zealand</option>
          <option value="gb">United Kingdom</option>
          <option value="us">United States</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Feature flags</FormLabel>
        <Controller
          name="featureFlags"
          control={control}
          render={({ field: { onChange, onBlur, value, name } }) => (
            <CreatableSelect
              isClearable
              isMulti={true}
              name={name}
              onBlur={onBlur}
              onChange={(options) => {
                const values = options.map(({ value }) => value);
                onChange(values);
              }}
              options={[].map((val) => ({
                value: val,
                label: val,
              }))}
              value={(value as string[]).map((val) => ({
                value: val,
                label: val,
              }))}
            />
          )}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Payments Traits</FormLabel>
        <Controller
          name="paymentsTraits"
          control={control}
          render={({ field: { onChange, onBlur, value, name } }) => (
            <CreatableSelect
              isClearable
              isMulti={true}
              name={name}
              onBlur={onBlur}
              onChange={(options) => {
                const values = options.map(({ value }) => value);
                onChange(values);
              }}
              options={AVAILABLE_PAYMENTS_TRAITS.map((val) => ({
                value: val,
                label: val,
              }))}
              value={(value as string[]).map((val) => ({
                value: val,
                label: val,
              }))}
            />
          )}
        />
      </FormControl>
      <Button
        colorScheme="brand"
        isLoading={isProcessing}
        onClick={handleSubmit(handleCreate)}
      >
        Create
      </Button>
    </VStack>
  );
};
