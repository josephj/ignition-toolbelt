import { allFeatureFlags } from './feature-flags';

export type FeatureFlag = (typeof allFeatureFlags)[number];
