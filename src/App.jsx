import React, { useState, useMemo } from "react";
import "./index.css";
import piesData from "./data/pies.json";
import PieCard from "./components/PieCard";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Стейт для хранения ID открытых групп. По умолчанию все открыты.
  const [openCategories, setOpenCategories] = useState(() => {
    const categories = {};
    piesData.pies.forEach((pie) => {
      categories[pie.category] = true;
    });
    return categories;
  });

  // Функция переключения видимости группы
  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Фильтрация и группировка пирогов
  const groupedPies = useMemo(() => {
    // 1. Сначала фильтруем по поисковому запросу
    const filtered = piesData.pies.filter((pie) =>
      pie.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // 2. Группируем по категориям
    const groups = {};
    filtered.forEach((pie) => {
      if (!groups[pie.category]) {
        groups[pie.category] = [];
      }
      groups[pie.category].push(pie);
    });

    // 3. Формируем массив для удобного рендера, берем красивые названия из словаря
    return Object.keys(groups).map((categoryId) => ({
      id: categoryId,
      title: piesData.dictionaries.categories[categoryId] || categoryId,
      items: groups[categoryId],
    }));
  }, [searchQuery]);

  return (
    <div className="app-container">
      <div className="top-promo-bar">
        Бесплатная доставка при заказе от 2 000 ₽
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск пирога по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Отображение сгруппированного списка */}
      <div className="categories-container">
        {groupedPies.length > 0 ? (
          groupedPies.map((group) => (
            <div key={group.id} className="category-section">
              {/* Заголовок группы (кнопка сворачивания) */}
              <button
                className="category-header"
                onClick={() => toggleCategory(group.id)}
              >
                <h2 className="category-title">{group.title}</h2>
                <span
                  className={`chevron ${openCategories[group.id] ? "open" : ""}`}
                >
                  ▼
                </span>
              </button>

              {/* Сетка карточек (показывается, если группа открыта) */}
              {openCategories[group.id] && (
                <div className="cards-grid">
                  {group.items.map((pie) => (
                    <PieCard
                      key={pie.id}
                      pie={pie}
                      sizesDict={piesData.sizes}
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "40px",
              color: "#757575",
              fontSize: "18px",
            }}
          >
            По вашему запросу ничего не найдено
          </div>
        )}
      </div>

      <footer className="footer">
        {isNotesOpen && (
          <div className="notes-menu">
            <div className="notes-menu-item">Закрытие смены</div>
            <div className="notes-menu-item">Итоги дня</div>
            <div className="notes-menu-item">Аналитика продаж</div>
            <div className="notes-menu-item">Настройки</div>
          </div>
        )}
        <button
          className="notes-btn"
          onClick={() => setIsNotesOpen(!isNotesOpen)}
        >
          Заметки
        </button>
      </footer>
    </div>
  );
}

export default App;
