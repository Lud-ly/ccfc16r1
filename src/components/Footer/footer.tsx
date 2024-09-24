const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-3" style={{ backgroundColor: "rgb(9, 87, 159)" }}>
      <h6 className="text-xs text-white font-semibold tracking-wide text-right mb-1">
        &copy; {currentYear}
      </h6>
      <p className="text-xs text-white text-right">Propulsé par L. Mouly</p>
    </footer>
  );
};

export default Footer;
