const Box = ({ children, styles, onClick }) => {
  const style = `rounded-xl bg-main-gray ${styles}`;

  return (
    <div className={style} onClick={onClick}>
      {children}
    </div>
  );
};

export default Box;
