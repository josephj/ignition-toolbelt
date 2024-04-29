import React, { useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useForm, Controller } from 'react-hook-form';
import { Button, FormControl, FormLabel, VStack } from '@chakra-ui/react';
import { GITHUB_AUTOFILL_SETTING } from './lib';

const availableReviewers = [
  { label: 'Andrei Railean', value: 'AndreiRailean' },
  { label: 'Aleks Milosev', value: 'aleksandarmilosev' },
  { label: 'Bill Tran', value: 'BillTmn' },
  { label: 'Corinne Brady', value: 'corinnebrady' },
  { label: 'Chris Nelson', value: 'chrisrbnelson' },
  { label: 'Daniel Norman', value: 'danielcnorman' },
  { label: 'Daniel Novikov', value: 'Daniel-Novikov' },
  { label: 'David Dinh', value: 'pi-ddinh' },
  { label: 'David Evans', value: 'davidevans-syd' },
  { label: 'David Smith', value: 'djs070' },
  { label: 'Dylan McKay', value: 'brassdylan' },
  { label: 'Emily Pasiak', value: 'pasiemignite' },
  { label: 'Gergely Karolyi', value: 'gkarolyi' },
  { label: 'Gareth Robinson', value: 'mehwoot' },
  { label: 'Ian Lenehan', value: 'ianlenehan' },
  { label: 'James Huang', value: 'james1239090' },
  { label: 'Jasmine', value: 'jasoji-ign' },
  { label: 'Joey Chen', value: 'joyfeel' },
  { label: 'Joseph Chiang', value: 'josephj' },
  { label: 'Jun Huang', value: 'iknowu10' },
  { label: 'Keith Rowell', value: 'keithrowell' },
  { label: 'Louie Esteban', value: 'wizardofosmium' },
  { label: 'Nick Dainty', value: 'nickpad' },
  { label: 'Moe Foster', value: 'Moeface' },
  { label: 'Ramil Mustafin', value: 'rmustafin' },
  { label: 'Stephan Slehta', value: 'StefanSlheta' },
  { label: 'Scott Arbeitman', value: 'friendofasquid' },
  { label: 'Tony Breckner', value: 'abreckner' },
  { label: 'Vikas Saroha', value: 'pi-vikassaroha' },
  { label: 'Walid Halabi', value: 'walidhalabi' },
  { label: 'Zillah Chen', value: 'zillahchen' },
];

const availableLabels = [
  { label: 'eng-backend', value: 'eng-backend' },
  { label: 'eng-frontend', value: 'eng-frontend' },
  { label: 'eng-team-interstellar', value: 'eng-team-interstellar' },
  { label: 'eng-team-nebula', value: 'eng-team-nebula' },
  { label: 'eng-team-orion', value: 'eng-team-orion' },
  { label: 'eng-team-rocket', value: 'eng-team-rocket' },
  { label: 'dev-ops', value: 'dev-ops' },
  { label: 'review-app', value: 'review-app' },
];

type FormValues = {
  reviewers: string[];
  labels: string[];
};

export const GithubAutofillSetting = () => {
  const { formState, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      reviewers: [],
      labels: [],
    },
  });

  const { isDirty, isLoading } = formState;

  useEffect(() => {
    chrome.storage.local.get([GITHUB_AUTOFILL_SETTING]).then((results) => {
      const { reviewers, labels } = results[GITHUB_AUTOFILL_SETTING] || {
        reviewers: [],
        labels: [],
      };
      reset({ reviewers, labels });
    });
  }, [reset]);

  const handleSave = ({ labels, reviewers }: FormValues) => {
    chrome.storage.local.set({
      [GITHUB_AUTOFILL_SETTING]: {
        labels,
        reviewers,
      },
    });
    reset({ reviewers, labels });
  };

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <VStack spacing="large">
        <FormControl>
          <FormLabel>Reviewers</FormLabel>
          <Controller
            name="reviewers"
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
                options={availableReviewers}
                value={(value as string[]).map((val) => ({
                  value: val,
                  label: val,
                }))}
              />
            )}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Labels</FormLabel>
          <Controller
            name="labels"
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
                options={availableLabels}
                value={(value as string[]).map((val) => ({
                  value: val,
                  label: val,
                }))}
              />
            )}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="brand"
          isDisabled={!isDirty}
          isLoading={isLoading}
        >
          Save
        </Button>
      </VStack>
    </form>
  );
};
