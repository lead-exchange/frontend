import { AppRoutes } from '@/navigation/routePaths';
import { createLead } from '@/requests/entities';
import { leadStore } from '@/stores/leadStore';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeadForm } from '@/components/LeadForm/LeadForm';
import { LeadFormData, DEFAULT_VALUES } from '@/components/LeadForm/schema';

export const LeadCreatePage: FC = () => {
  const navigate = useNavigate();

  const onSubmit = async (data: LeadFormData) => {
    const leadData = {
      name: data.name.trim(),
      commissionShare: data.commissionShare,
      requirements: {
        description: data.description || undefined,
        propertyType: data.propertyType,
        minPrice: data.minPrice || 0,
        maxPrice: data.maxPrice || 0,
        minArea: data.minArea || 0,
        maxArea: data.maxArea || 0,
        minKitchenArea: data.minKitchenArea || undefined,
        maxKitchenArea: data.maxKitchenArea || undefined,
        renovation: data.renovationType,
        locations: data.locations
          .split(',')
          .map(loc => loc.trim())
          .filter(Boolean),
        bedrooms: data.bedrooms || undefined,
      },
    };

    try {
      const createLeadData = await createLead(leadData);
      leadStore.addLead(createLeadData);
      navigate(AppRoutes.lead.details(createLeadData.id), { replace: true });
    } catch (error) {
      console.error('Failed to create lead:', error);
      alert('Ошибка при создании лида. Попробуйте еще раз.');
    }
  };

  return (
    <LeadForm 
      initialValues={DEFAULT_VALUES} 
      onSubmit={onSubmit} 
    />
  );
};
