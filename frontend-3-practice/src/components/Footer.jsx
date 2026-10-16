
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-col brand-col">
            <span className="footer-logo">MOSS</span>
            <p className="footer-address">Москва, ул. Большая Никитская, 22</p>
            <a href="tel:+74951202418" className="footer-phone">+7 (495) 120-24-18</a>
          </div>

          <div className="footer-col">
            <span className="footer-heading">МЫ ОТКРЫТЫ</span>
            <p className="footer-text">Ежедневно · 10:00–21:00</p>
            <p className="footer-subtext">Запись по предварительной брони</p>
          </div>

          <div className="footer-col">
            <span className="footer-heading">НАПИШИ НАМ</span>
            <div className="social-links">
              <a href="#">Telegram</a>
              <span>·</span>
              <a href="#">WhatsApp</a>
            </div>
            <a href="mailto:hello@moss.studio" className="footer-email">hello@moss.studio</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">MOSS · beauty studio</span>
          <span className="footer-hours-mini">Ежедневно · 10:00–21:00</span>
        </div>
      </div>
    </footer>
  );
}
