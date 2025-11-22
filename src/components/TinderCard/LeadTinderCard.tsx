import { type FC } from "react";
import { Card } from "@telegram-apps/telegram-ui";
import type { Lead } from "@/types/entity";
import "./TinderCard.css";

interface LeadTinderCardProps {
  data: Lead;
  onSwipe?: (direction: "left" | "right" | "up") => void;
}

export const LeadTinderCard: FC<LeadTinderCardProps> = ({ data }) => {
  const lead = data as Lead;
  const { requirements, commissionShare, description } = lead;

  const propertyTypeMap = {
    apartment: "квартира",
    house: "дом",
    commercial: "коммерческое",
  };

  return (
    <Card className="tinder-card">
      <div className="tinder-card__content">
        <div className="tinder-card__info">
          <h3 className="tinder-card__title">{lead.name}</h3>

          <p className="tinder-card__subtitle">
            Ищет {requirements.bedrooms ? `${requirements.bedrooms}-комн.` : ""}{" "}
            {propertyTypeMap[requirements.propertyType]}
          </p>

          <p className="tinder-card__details">
            {requirements.minArea}-{requirements.maxArea} кв.м.
          </p>

          <p className="tinder-card__details">
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
              maximumFractionDigits: 0,
            }).format(requirements.minPrice)}{" "}
            –{" "}
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
              maximumFractionDigits: 0,
            }).format(requirements.maxPrice)}
          </p>

          <div className="tinder-card__commission">
            <p className="tinder-card__commission-seller">
              Агент продавца: {100 - commissionShare}%
            </p>
            <p className="tinder-card__commission-buyer">
              Агент покупателя: {commissionShare}%
            </p>
          </div>
        </div>

        <div className="tinder-card__chips">
          {requirements.locations.map((location, idx) => (
            <span key={idx} className="tinder-card__chip">
              {location}
            </span>
          ))}

          {requirements.repairType?.map((repair, idx) => (
            <span key={`repair-${idx}`} className="tinder-card__chip">
              {repair}
            </span>
          ))}

          {requirements.marketType?.map((market, idx) => (
            <span key={`market-${idx}`} className="tinder-card__chip">
              {market}
            </span>
          ))}

          {requirements.paymentType?.map((payment, idx) => (
            <span key={`payment-${idx}`} className="tinder-card__chip">
              {payment}
            </span>
          ))}
        </div>

        {description && (
          <p className="tinder-card__description">{description}</p>
        )}
      </div>
    </Card>
  );
};
