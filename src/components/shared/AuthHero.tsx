import React from 'react';

const AuthHero: React.FC = () => {
  return (
    <div className="hidden lg:block w-1/2 h-screen sticky top-0 p-4 ">
      <div className="w-full h-full border border-[#E8E8E9] rounded-3xl relative overflow-hidden">
        {/* Background */}
        <div 
          style={{
            position: 'absolute',
            left: '0px',
            right: '0px',
            top: '0px',
            bottom: '0px',
            background: 'radial-gradient(106.59% 153.23% at 66.62% 0%, #41567F 0%, #2E4166 100%)',
            borderRadius: '20px'
          }}
        />
        
        {/* Decorative logo elements */}
        <img 
          src="/lovable-uploads/bd28609d-7d3d-4a9c-841f-aa2ac0cac4b2.png"
          alt="Decorative logo"
          className="absolute object-contain opacity-10"
          loading="lazy"
          style={{
            position: 'absolute',
            left: '40.35%',
            right: '13.83%',
            top: '45.78%',
            bottom: '-20.21%',
            objectFit: 'contain',
            opacity: 0.1
          }}
        />
        <img 
          src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png"
          alt="Decorative logo"
          className="absolute object-contain opacity-10"
          loading="lazy"
          style={{
            position: 'absolute',
            left: '13.67%',
            right: '40.51%',
            top: '65.15%',
            bottom: '-39.58%',
            objectFit: 'contain',
            opacity: 0.1
          }}
        />
        
        {/* Logo Container */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            height: 'auto'
          }}
        >
          <img 
            src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
            alt="GRH Logo" 
            loading="lazy"
            style={{
              maxWidth: '300px',
              maxHeight: '150px',
              width: 'auto',
              height: 'auto',
              filter: 'brightness(0) invert(1)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthHero;