import { q, simulateSelect, simulateClick } from '../../lib';

export const autofillAboutBusinessPage = async (shouldClickNext = false) => {
  const businessTypeSelect = q('select#business_type');
  if (businessTypeSelect) {
    simulateSelect('#business_type', 'Individual / Sole Trader');
  }

  const companyStructure = q('#company_structure_0');
  if (companyStructure) {
    simulateClick(companyStructure);
  }

  if (shouldClickNext) {
    const nextButton = q('a:contains("Continue")');
    if (nextButton) {
      simulateClick(nextButton);
    }
  }
};
