import {
  makeIgnitionRequest,
  makeMissionControlRequest,
} from '../../../../lib/graphql';

export const getPracticeId = (href: string) => {
  const matches = href.match(
    /https:\/\/go\.ignitionapp\.com\/console\/practice\/([^/]+)/
  );
  return matches ? matches[1] : null;
};

export const checkPracticeLogin = async ({
  referenceNumber,
}: {
  referenceNumber: string;
}) => {
  console.log(
    `[DEBUG] checkPracticeLogin({ referenceNumber = "${referenceNumber}" })`
  );
  try {
    const { currentPractice } = await makeIgnitionRequest({
      query: `query { currentPractice { referenceNumber } }`,
      variables: {},
    });
    return currentPractice?.referenceNumber === referenceNumber;
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
  }
};

export const checkMissionControlLogin = async () => {
  console.log(`[DEBUG] checkMissionControlLogin()`);
  try {
    const data = await makeMissionControlRequest({
      query: `query { codeVersion }`,
      variables: {},
    });
    console.log('[DEBUG] checkMissionControlLogin() data', data);
    return !!data?.codeVersion;
  } catch (e) {
    return false;
  }
};
