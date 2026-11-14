import React, { useState } from "react";

export default function PieCard({ pie, sizesDict, onToggleStop }) {
  const [selectedSizeKey, setSelectedSizeKey] = useState(
    pie.available_sizes[0],
  );
  const currentSize = sizesDict[selectedSizeKey];
  const totalPrice = Math.round(pie.price_per_kg * currentSize.kg);

  const [imageError, setImageError] = useState(false);
  const cleanPath = pie.image_url ? pie.image_url.replace(/^\/+/, "") : "";
  const imageSrc = pie.image_url
    ? `${import.meta.env.BASE_URL}${cleanPath}`
    : null;
  const hasImage = imageSrc && !imageError;

  return (
    <div className={`card ${pie.is_stop ? "is-stopped" : ""}`}>
      <div className="card-header">
        <select
          className="select-kg"
          value={selectedSizeKey}
          onChange={(e) => setSelectedSizeKey(e.target.value)}
        >
          {pie.available_sizes.map((sizeKey) => (
            <option key={sizeKey} value={sizeKey}>
              кг ({sizeKey})
            </option>
          ))}
        </select>

        {/* Кнопка переключения стопа в шапке карточки */}
        <button
          className={`stop-toggle-btn ${pie.is_stop ? "active" : ""}`}
          onClick={() => onToggleStop(pie.id)}
          title={pie.is_stop ? "Убрать из стопа" : "Отправить в стоп"}
        >
          {pie.is_stop ? "В СТОПЕ" : "В СТОП"}
        </button>
      </div>

      <div className="image-container">
        {hasImage ? (
          <img
            src={imageSrc}
            alt={pie.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">Картинка пирога</div>
        )}

        <div className="badges">
          <div className="badge">
            {currentSize.diameter_cm_min}-{currentSize.diameter_cm_max} см
          </div>
          <div className="badge">
            {currentSize.persons_min}-{currentSize.persons_max} чел
          </div>
        </div>

        {pie.is_stop && (
          <div className="stop-overlay">
            <div className="stop-label">В СТОПЕ</div>
          </div>
        )}
      </div>

      <div className="pie-title">{pie.name}</div>
      <div className="pie-details">
        Тесто:{" "}
        <span>{pie.dough === "puff_sand" ? "слоёно-песочное" : pie.dough}</span>
      </div>
      <div className="pie-details">
        Состав: <span>{pie.ingredients.join(", ")}</span>
      </div>

      <div className="price-container">
        <div className="price-label">Стоимость</div>
        <div className="price">{totalPrice} ₽</div>
      </div>
    </div>
  );
}
