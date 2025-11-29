import { getLeadById } from "@/requests/entities";
import { Lead } from "@/types/entity";
import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Chip, Button } from "@telegram-apps/telegram-ui";
import { Archive, Check, Pencil } from "lucide-react";

const propertyTypeLabels: Record<string, string> = {
    flat: 'Квартира',
    room: 'Комната',
    commerce: 'Коммерция',
    house: 'Загородка',
    land: 'Участок',
    garage: 'Машиноместо/гараж',
};

const formatPrice = (price: number): string => {
    if (price >= 1000000) {
        return `${(price / 1000000).toFixed(0)} млн.`;
    }
    return `${price.toLocaleString('ru-RU')} ₽`;
};

export const LeadPage: FC = () => {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [lead, setLead] = useState<Lead | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!leadId) return;

            setLoading(true);

            try {
                const leadData = await getLeadById(leadId);
                setLead(leadData);
            } catch (error) {
                console.error('Failed to load lead:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [leadId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner size="l" />
            </div>
        );
    }

    if (!lead) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Лид не найден</p>
            </div>
        );
    }

    const priceRange = `< ${formatPrice(lead.requirements.maxPrice)}`;
    const bedroomsText = lead.requirements.bedrooms ? `${lead.requirements.bedrooms}-комн.` : null;

    return (
        <div style={{ padding: '16px', backgroundColor: 'var(--tgui--bg_color)' }}>
            {/* Имя клиента */}
            <h1 style={{
                fontSize: '24px',
                fontWeight: '600',
                textAlign: 'center',
                margin: '24px 0 32px 0',
                color: 'var(--tgui--text_color)'
            }}>
                {lead.name}
            </h1>

            {/* Chips с основной информацией */}
            <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '16px'
            }}>
                <Chip mode="mono">
                    {propertyTypeLabels[lead.requirements.propertyType]}
                </Chip>
                {bedroomsText && (
                    <Chip mode="mono">
                        {bedroomsText}
                    </Chip>
                )}
                <Chip mode="mono">
                    {priceRange}
                </Chip>
            </div>

            {/* Локации */}
            {lead.requirements.locations && lead.requirements.locations.length > 0 && (
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '24px'
                }}>
                    {lead.requirements.locations.map((location, index) => (
                        <Chip key={index} mode="mono">
                            {location}
                        </Chip>
                    ))}
                </div>
            )}

            {/* Комиссии */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{
                    color: 'var(--tgui--link_color)',
                    fontSize: '16px',
                    marginBottom: '4px'
                }}>
                    Агент покупателя: {lead.commissionShare}%
                </div>
                <div style={{
                    color: 'var(--tgui--link_color)',
                    fontSize: '16px'
                }}>
                    Агент продавца: {100 - lead.commissionShare}%
                </div>
            </div>

            {/* Описание */}
            {lead.description && (
                <div style={{
                    color: 'var(--tgui--text_color)',
                    fontSize: '15px',
                    lineHeight: '20px',
                    marginBottom: '24px'
                }}>
                    {lead.description}
                </div>
            )}

            {/* Кнопки действий */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px'
            }}>
                <Button
                    mode="bezeled"
                    size="m"
                    before={<Pencil />}
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/user/lead/${leadId}/edit`)}
                >
                    Редакт.
                </Button>
                <Button
                    mode="bezeled"
                    size="m"
                    before={<Archive />}
                    style={{ flex: 1 }}
                >
                    Приост.
                </Button>
                <Button
                    mode="bezeled"
                    size="m"
                    before={<Check />}
                    style={{ flex: 1 }}
                >
                    Заверш.
                </Button>
            </div>

            {/* Кнопка рекомендаций */}
            <Button
                mode="filled"
                size="l"
                stretched
            >
                Смотреть рекомендации
            </Button>
        </div>
    );
}