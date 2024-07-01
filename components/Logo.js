const Logo = ({className}) => {
  return (
    <div className="text-center">
      <img src="/Logo.svg" className={`${className} w-3/4`}/>
    </div>
  );
};

export default Logo;