import React, { useState, useMemo } from "react";
// import './App.css';
import piesData from "./data/pies.json";
import PieCard from "./components/PieCard";
import { useLocalStorage } from "./hooks/useLocalStorage";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Загружаем данные из localStorage (или из JSON, если там пусто)
  const [pies, setPies] = useLocalStorage("pies_catalog", piesData.pies);

  const [openCategories, setOpenCategories] = useState(() => {
    const categories = {};
    piesData.pies.forEach((pie) => {
      categories[pie.category] = true;
    });
    return categories;
  });

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  // ЕДИНСТВЕННАЯ ЛОГИКА ИЗМЕНЕНИЯ: Переключение стопа
  const toggleStop = (id) => {
    setPies((prev) =>
      prev.map((pie) =>
        pie.id === id ? { ...pie, is_stop: !pie.is_stop } : pie,
      ),
    );
  };

  // Сброс к исходным данным (на случай ошибок)
  const resetData = () => {
    if (
      window.confirm("Сбросить все изменения к исходным данным из pies.json?")
    ) {
      setPies(piesData.pies);
      setIsNotesOpen(false);
    }
  };

  // Фильтрация и группировка
  const groupedPies = useMemo(() => {
    const filtered = pies.filter((pie) =>
      pie.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const groups = {};
    filtered.forEach((pie) => {
      if (!groups[pie.category]) groups[pie.category] = [];
      groups[pie.category].push(pie);
    });

    return Object.keys(groups).map((categoryId) => ({
      id: categoryId,
      title: piesData.dictionaries.categories[categoryId] || categoryId,
      items: groups[categoryId],
    }));
  }, [searchQuery, pies]);

  return (
    <div className="app-container">
      <div className="top-promo-bar">
        Бесплатная доставка при заказе от 2 000 ₽ по городу!
      </div>

      <nav className="navbar">
        <div className="logo">Домашние пироги</div>
        <span>
          <ul>
            <label>Скидки</label>
            <li>10% - ДР и Самовывоз</li>
            <li>7% - Профсоюзная карта</li>
          </ul>
        </span>
      </nav>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск пирога по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="categories-container">
        {groupedPies.length > 0 ? (
          groupedPies.map((group) => (
            <div key={group.id} className="category-section">
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

              {openCategories[group.id] && (
                <div className="cards-grid">
                  {group.items.map((pie) => (
                    <PieCard
                      key={pie.id}
                      pie={pie}
                      sizesDict={piesData.sizes}
                      onToggleStop={toggleStop} // Передаем только функцию стопа
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
            <div
              className="notes-menu-item"
              onClick={resetData}
              style={{ color: "red" }}
            >
              Сбросить данные к исходным
            </div>
          </div>
        )}
        <button
          className="notes-btn"
          onClick={() => setIsNotesOpen(!isNotesOpen)}
        >
          Настройки
        </button>
      </footer>
    </div>
  );
}

export default App;
