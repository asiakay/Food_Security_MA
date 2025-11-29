import { Business, BusinessCategory } from '../types';

const normalizeText = (value: string | undefined | null) => value?.toLowerCase() || '';

const inferFromBusinessType = (business: Business): BusinessCategory[] => {
  const inferred: BusinessCategory[] = [];

  switch (business.business_type) {
    case 'farm':
      inferred.push('produce_farm');
      break;
    case 'farmers_market':
      inferred.push('farmers_market');
      break;
    case 'food_business':
      inferred.push('food_vendor');
      break;
    case 'supplier':
    case 'service_provider':
      inferred.push('agricultural_services');
      break;
    case 'showcase_project':
      inferred.push('showcase_project');
      break;
    default:
      break;
  }

  return inferred;
};

const inferFromContent = (business: Business): BusinessCategory[] => {
  const inferred: BusinessCategory[] = [];
  const activity = normalizeText(business.activity);

  if (activity.includes('market')) {
    inferred.push('farmers_market');
  }

  if (activity.includes('farm')) {
    inferred.push('produce_farm');
  }

  if (business.showcase_project?.is_showcase) {
    inferred.push('showcase_project');
  }

  return inferred;
};

export const getBusinessCategories = (business: Business): BusinessCategory[] => {
  const explicitCategories = business.categories || [];
  const inferredCategories = [
    ...inferFromBusinessType(business),
    ...inferFromContent(business),
  ];

  return Array.from(new Set([...explicitCategories, ...inferredCategories]));
};
