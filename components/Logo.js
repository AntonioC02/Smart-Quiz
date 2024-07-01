import Image from 'next/image';

const Logo = ({className}) => {
  return (
    <div className="text-center">
      <Image src="/Logo.svg" alt="logo" className={`${className} w-3/4`}/>
    </div>
  );
};

export default Logo;