import { getLeadById, updateLead } from '@/requests/entities';
import { Lead } from '@/types/entity';
import { Spinner } from '@telegram-apps/telegram-ui';
import { type FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LeadForm } from '@/components/LeadForm/LeadForm';
import { LeadFormData } from '@/components/LeadForm/schema';
import { AppRoutes } from '@/navigation/routePaths';

export const LeadEditPage: FC = () => {
  const navigate = useNavigate();
  const { leadId } = useParams<{ leadId: string }>();
  const [loading, setLoading] = useState(true);
  const [lead, setLead] = useState<Lead | null>(null);

  useEffect(() => {
    const loadLead = async () => {
      if (!leadId) return;

      setLoading(true);
      try {
        const leadData = await getLeadById(leadId);
        setLead(leadData);
      } catch (error) {
        console.error('Failed to load lead:', error);
        alert('Ошибка при загрузке лида');
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [leadId]);

  const initialValues: Partial<LeadFormData> | undefined = lead ? {
    name: lead.name || '',
    commissionShare: lead.commissionShare,
    propertyType: lead.requirements.propertyType,
    minPrice: lead.requirements.minPrice,
    maxPrice: lead.requirements.maxPrice,
    minArea: lead.requirements.minArea,
    maxArea: lead.requirements.maxArea,
    minKitchenArea: lead.requirements.minKitchenArea,
    maxKitchenArea: lead.requirements.maxKitchenArea,
    renovationType: lead.requirements.renovation || 'ANY',
    locations: lead.requirements.locations.join(', '),
    bedrooms: lead.requirements.bedrooms || undefined,
    description: lead.requirements.description || '',
  } : undefined;

  const onSubmit = async (data: LeadFormData) => {
    if (!leadId) return;

    const leadData = {
      name: data.name.trim(),
      commissionShare: data.commissionShare,
      requirements: {
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
        description: data.description || undefined,
      },
    };

    try {
      await updateLead(leadId, leadData);
      navigate(AppRoutes.lead.details(leadId), { replace: true });
    } catch (error) {
      console.error('Failed to update lead:', error);
      alert('Ошибка при обновлении лида');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <LeadForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      submitText="Сохранить изменения"
    />
  );
};
