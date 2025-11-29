import { Business, BusinessCategory, BusinessType } from '../types';
import { getBusinessCategories } from './businessCategories';

const normalizeText = (value: string | undefined | null) => value?.toLowerCase() || '';

const categoryToBusinessType: Partial<Record<BusinessCategory, BusinessType>> = {
  produce_farm: 'farm',
  farmers_market: 'farmers_market',
  food_vendor: 'food_business',
  hempcrete_supplier: 'supplier',
  greenhouse_builder: 'service_provider',
  solar_installer: 'service_provider',
  sustainable_building: 'service_provider',
  agricultural_services: 'service_provider',
  showcase_project: 'showcase_project',
};

export const getBusinessType = (business: Business): BusinessType | null => {
  if (business.business_type) return business.business_type;

  const categories = getBusinessCategories(business);
  for (const category of categories) {
    const mappedType = categoryToBusinessType[category];
    if (mappedType) return mappedType;
  }

  const activity = normalizeText(business.activity);

  if (business.showcase_project?.is_showcase) return 'showcase_project';
  if (activity.includes('market')) return 'farmers_market';
  if (activity.includes('farm')) return 'farm';
  if (
    activity.includes('restaurant') ||
    activity.includes('kitchen') ||
    activity.includes('bakery') ||
    activity.includes('cafe') ||
    activity.includes('food')
  ) {
    return 'food_business';
  }
  if (activity.includes('supplier') || activity.includes('wholesale') || activity.includes('distributor')) {
    return 'supplier';
  }
  if (
    activity.includes('service') ||
    activity.includes('consult') ||
    activity.includes('builder') ||
    activity.includes('install') ||
    activity.includes('design') ||
    activity.includes('contract')
  ) {
    return 'service_provider';
  }

  return null;
};
