import { type FC } from "react";
import { Card } from "@telegram-apps/telegram-ui";
import type { RealEstateObject } from "@/types/entity";
import "./TinderCard.css";

import { ImageWithSlider } from "@/components/common/ImageWithSlider";

interface ObjectTinderCardProps {
  data: RealEstateObject;
}

export const ObjectTinderCard: FC<ObjectTinderCardProps> = ({ data }) => {
  const { attributes, commissionShare } = data;
  const photos = attributes.photos ?? [];

  return (
    <Card className="tinder-card">
      <div className="tinder-card__content">
        <ImageWithSlider photos={photos} title={attributes.title} />

        <div className="tinder-card__info">
          <h3 className="tinder-card__title">{attributes.title}</h3>

          <p className="tinder-card__price">
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
              maximumFractionDigits: 0,
            }).format(attributes.price)}
          </p>

          <p className="tinder-card__address">{attributes.address}</p>

          <div className="tinder-card__commission">
            <p className="tinder-card__commission-buyer">
              Агент покупателя: {commissionShare}%
            </p>

            <p className="tinder-card__commission-seller">
              Агент продавца: {100 - commissionShare}%
            </p>
          </div>
        </div>

        <div className="tinder-card__chips">
          {attributes.propertyClass && (
            <span className="tinder-card__chip">
              {attributes.propertyClass}
            </span>
          )}

          {attributes.repairType && (
            <span className="tinder-card__chip">{attributes.repairType}</span>
          )}

          {attributes.marketType?.map((market, idx) => (
            <span key={`market-${idx}`} className="tinder-card__chip">
              {market}
            </span>
          ))}

          {attributes.paymentType?.map((payment, idx) => (
            <span key={`payment-${idx}`} className="tinder-card__chip">
              {payment}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
