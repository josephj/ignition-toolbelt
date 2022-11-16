import { FormLabel, HStack, Switch, VStack } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { allFeatures } from '../../lib/features';

type Feature = (typeof allFeatures)[number];

const getActiveTab = async () => {
  const [activeTab] = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  return activeTab;
};

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
    const activeTab = await getActiveTab();
    const isChecked = (e.target as HTMLInputElement).checked;

    setFeatureStates((prevState) => {
      const nextState = prevState.map(([f, value]) =>
        f === feature ? [f, isChecked] : [f, value]
      ) as Mapping[];
      if (activeTab.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          type: feature,
          value: isChecked,
        });
      }
      chrome.storage.local.set({ [feature]: isChecked });
      return nextState;
    });
  };

  return (
    <VStack>
      {featureStates.map(([feature, value]) => (
        <HStack key={feature}>
          <Switch
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
    </VStack>
  );
};
