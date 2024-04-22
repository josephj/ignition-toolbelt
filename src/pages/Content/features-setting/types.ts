import type { FeatureFlag } from '../lib';

export type FeatureItem = {
  id: FeatureFlag;
  title: string;
  description: string;
  stage?: 'string';
};
