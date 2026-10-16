export default function Header() {
  return (
    <header className="site-header">
      <div className="header-top">
        <a href="#" className="brand-logo">
          <span className="brand-title">MOSS</span>
          <span className="brand-subtitle">BEAUTY ATELIER</span>
        </a>
        <nav className="main-nav">
          <a href="#" className="nav-link">Услуги</a>
          <a href="#" className="nav-link">Мастера</a>
          <a href="#" className="nav-link">Контакты</a>
        </nav>
        <button className="help-btn" type="button">Нужна помощь?</button>
      </div>

      <div className="progress-bar-container">
        <div className="progress-info">
          <span className="step-counter">ШАГ 4 ИЗ 6</span>
          <span className="step-name">Дата и время</span>
        </div>
        <div className="progress-segments">
          <div className="segment completed"></div>
          <div className="segment completed"></div>
          <div className="segment completed"></div>
          <div className="segment active"></div>
          <div className="segment"></div>
          <div className="segment"></div>
        </div>
      </div>
    </header>
  );
}
