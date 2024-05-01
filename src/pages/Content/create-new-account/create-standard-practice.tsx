import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useBoolean,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { createBasePractice, devClient, signIn } from './util';
import MUTATION_CREATE_STANDARD_ACCOUNT from '../../../graphql/dev_api/mutation.seedStandardPractice.graphql';
import { Acknowledgement } from '@generated/ignition/types';

const STANDARD_PRACTICE_FORM_VALUES = 'standard-practice-form-values';
const DEFAULT_VALUES = {
  name: 'Goodman & Co.',
  country: 'au',
  featureFlags: [],
  proposalEditor: 'preferred_npe',
  subscriptionStatus: 'subscribed_core',
  integrations: [],
  proposalsTraits: [],
};

const AVAILABLE_INTEGRATIONS = [
  'gusto',
  'qbo',
  'xero',
  'xpm',
  'proconnect',
] as const;
const AVAILABLE_PROPOSAL_TRAITS = [
  'accepted',
  'accepts_credit_card',
  'accepts_direct_debit',
  'approved',
  'archived',
  'awaiting_acceptance',
  'change_requested',
  'completed',
  'draft',
  'lost',
  'new',
  'not_in_review',
  'review_requested',
  'search_indexed',
  'sent',
  'signed',
  'signed_externally_and_accepted',
  'signed_internally',
  'signed_internally_and_accepted',
  'skip_search_index',
  'start_on_acceptance',
  'start_on_date',
  'user_as_sender',
  'with_accepted_client_services',
  'with_brochure',
  'with_multiple_options',
  'with_multiple_signatories',
  'with_next_steps_message',
  'with_payment_method_bank_account',
  'with_payment_method_credit_card',
  'with_recipient',
  'with_signatory',
  'with_videos',
  'with_workflow',
] as const;

type Integration = (typeof AVAILABLE_INTEGRATIONS)[number];
type ProposalTrait = (typeof AVAILABLE_PROPOSAL_TRAITS)[number];

const ACCESSED_ACKNOWLEDGEMENTS_LOG = 'accessed_acknowledgements';

type FormValues = {
  name: string;
  country: string;
  featureFlags: string[];
  proposalEditor: string;
  subscriptionStatus: string;
  integrations: Integration[];
  proposalsTraits: ProposalTrait[];
};

export const CreateStandardPractice = () => {
  const [isProcessing, setProcessing] = useBoolean();
  const [acks, setAcks] = useState<Acknowledgement[]>([]);
  const { control, register, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: 'Goodman & Co.',
      country: 'au',
      featureFlags: [],
      proposalEditor: 'preferred_npe',
      subscriptionStatus: 'subscribed_core',
      integrations: [],
      proposalsTraits: [],
    },
  });

  useEffect(() => {
    chrome.storage.local
      .get([STANDARD_PRACTICE_FORM_VALUES, ACCESSED_ACKNOWLEDGEMENTS_LOG])
      .then((results) => {
        const cache = results[STANDARD_PRACTICE_FORM_VALUES] || DEFAULT_VALUES;
        reset(cache);
        setAcks(results[ACCESSED_ACKNOWLEDGEMENTS_LOG] || []);
      });
  }, [reset]);

  const handleCreate = async (formValues: FormValues) => {
    const {
      name,
      country,
      featureFlags,
      proposalEditor,
      subscriptionStatus,
      proposalsTraits,
      integrations,
    } = formValues;

    setProcessing.on();
    const { practiceId, email } = await createBasePractice({
      name,
      country,
      proposalEditor,
      subscriptionStatus,
      featureFlags,
    });
    await devClient.mutate({
      mutation: MUTATION_CREATE_STANDARD_ACCOUNT,
      variables: { practiceId, proposalsTraits, integrations },
    });
    await chrome.storage.local.set({
      [STANDARD_PRACTICE_FORM_VALUES]: formValues,
    });
    await signIn({ email });
    window.location.href = '/';
    setProcessing.off();
  };

  return (
    <VStack spacing="large">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input {...register('name')} />
      </FormControl>
      <FormControl>
        <FormLabel>Country</FormLabel>
        <Select {...register('country')}>
          <option value="au">Australia</option>
          <option value="ca">Canada</option>
          <option value="nz">New Zealand</option>
          <option value="gb">United Kingdom</option>
          <option value="us">United States</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Proposal editor</FormLabel>
        <Select {...register('proposalEditor')}>
          <option value="preferred_npe">NPE Only</option>
          <option value="no_preferred_editor">NPE + CPE</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Subscription Plan</FormLabel>
        <Select {...register('subscriptionStatus')}>
          <option value="">Trial</option>
          <option value="subscribed">Subscribed</option>
          <option value="subscribed_professional">Professional</option>
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
              options={acks.map(({ id }) => ({
                value: id,
                label: id,
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
        <FormLabel>Integrations</FormLabel>
        <Controller
          name="integrations"
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
              options={AVAILABLE_INTEGRATIONS.map((val) => ({
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
        <FormLabel>Proposal Traits</FormLabel>
        <Controller
          name="proposalsTraits"
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
              options={AVAILABLE_PROPOSAL_TRAITS.map((val) => ({
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
