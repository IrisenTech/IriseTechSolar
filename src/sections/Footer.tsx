import Image from 'next/image';
import logo from '@/assets/logosaas.png';
import SocialLx from '@/assets/social-x.svg';
import SocialInsta from '@/assets/social-insta.svg';
import SocialLinkedIn from '@/assets/social-linkedin.svg';
import SocialPin from '@/assets/social-pin.svg';
import SocialYoutube from '@/assets/social-youtube.svg';


export const Footer = () => {
  return (
    <footer className='bg-black text-[#BCBCBC] text-sm text-center py-10 '>  
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:w-full before:blur before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
             <Image src={logo} alt="Logo" height={40} className="relative"/>
        </div>
            <nav className='flex flex-col md:flex-row md:justify-center gap-6 mt-6'>
              <a href="#">About</a>
              <a href="#">Features</a>
              <a href="#">CUstumers</a>
              <a href="#">Pricing</a>
              <a href="#">Help</a>
              <a href="#">Contact</a>
              <a href="#">Careers</a>
            </nav> 
            <div className='flex justify-center gap-6 mt-6'>
              <SocialLx />
              <SocialInsta />
              <SocialLinkedIn/>
              <SocialPin/>
              <SocialYoutube/>
            </div> 
            <p className='mt-6'>&copy; 2026</p>
          

      </div>
    </footer>
  );
};
