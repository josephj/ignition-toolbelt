import { Center, FormLabel, HStack, Switch, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { allFeatures } from '../../lib/features';

type Feature = (typeof allFeatures)[number];
type Mapping = [Feature, boolean];

export const RefinedIgnition = () => {
  const [featureStates, setFeatureStates] = useState<Mapping[]>([]);
  useEffect(() => {
    chrome.storage.local.get(allFeatures, (result) => {
      const mappings = allFeatures.map((feature) => [
        feature,
        result[feature] || false,
      ]);
      setFeatureStates(mappings as Mapping[]);
    });
  }, []);

  const handleToggleFeature = (feature: Feature) => async (e: ChangeEvent) => {
    const isChecked = (e.target as HTMLInputElement).checked;

    setFeatureStates((prevState) => {
      const nextState = prevState.map(([f, value]) =>
        f === feature ? [f, isChecked] : [f, value]
      ) as Mapping[];
      chrome.runtime.sendMessage({
        type: feature,
        value: isChecked,
      });
      chrome.storage.local.set({ [feature]: isChecked });
      return nextState;
    });
  };

  return (
    <Center>
      <VStack alignItems="flex-start" textAlign="left">
        <HStack>
          <Switch size="lg" isChecked isDisabled />
          <FormLabel fontSize="12px">
            Jira - Quick MC Login in HELP tickets
          </FormLabel>
        </HStack>
        <HStack>
          <Switch size="lg" isChecked isDisabled />
          <FormLabel fontSize="12px">
            Github - Autolink the Jira tickets
          </FormLabel>
        </HStack>
        {featureStates.map(([feature, value]) => (
          <HStack key={feature}>
            <Switch
              size="lg"
              defaultChecked={value}
              id={`toggle-${feature}`}
              onChange={handleToggleFeature(feature)}
            />
            <FormLabel
              fontSize="12px"
              htmlFor={`toggle-${feature}`}
              width="150px"
            >
              {feature}
            </FormLabel>
          </HStack>
        ))}
        <HStack>
          <Switch size="lg" isChecked isDisabled />
          <FormLabel fontSize="12px">Autofill the Sign-up pages</FormLabel>
        </HStack>
        <HStack>
          <Switch size="lg" isChecked isDisabled />
          <FormLabel fontSize="12px">Autofill the Subscription page</FormLabel>
        </HStack>
        <HStack>
          <Switch size="lg" isChecked isDisabled />
          <FormLabel fontSize="12px">
            Autofill the Disbursal bank account page
          </FormLabel>
        </HStack>
        <HStack>
          <Switch size="lg" isChecked isDisabled />
          <FormLabel fontSize="12px">
            Autofill the Stripe verification pages
          </FormLabel>
        </HStack>
      </VStack>
    </Center>
  );
};
