"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Marquee from "react-fast-marquee";
import { Nerko_One, Rubik } from "next/font/google";
import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname, Locale } from "@/i18n/routing"; 

const nerkoOne = Nerko_One({ subsets: ["latin"], weight: "400" });
const rubik = Rubik({ 
  subsets: ["latin", "cyrillic"], 
  weight: ["400", "700", "800"] 
});

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Font selection function
const getFontClass = (locale) => {
  switch (locale) {
    case 'ru':
    case 'kz':
      return rubik.className;
    case 'en':
    default:
      return nerkoOne.className;
  }
};

// Font size function for different locales
const getFontSizeClass = (locale, baseSize) => {
  const sizeMapping = {
    // For main headers (like h1 titles)
    'header-main': {
      'en': 'text-6xl sm:text-8xl',
      'ru': 'text-5xl sm:text-7xl', 
      'kz': 'text-5xl sm:text-7xl'
    },
    // For section titles  
    'header-section': {
      'en': 'text-4xl sm:text-6xl',
      'ru': 'text-3xl sm:text-5xl',
      'kz': 'text-3xl sm:text-5xl'
    },
    // For feature titles
    'header-feature': {
      'en': 'text-6xl',
      'ru': 'text-5xl',
      'kz': 'text-5xl'
    },
    // For card titles
    'header-card': {
      'en': 'text-2xl sm:text-3xl',
      'ru': 'text-xl sm:text-2xl',
      'kz': 'text-xl sm:text-2xl'
    },
    // For review titles
    'header-reviews': {
      'en': 'text-3xl sm:text-7xl',
      'ru': 'text-2xl sm:text-6xl',
      'kz': 'text-2xl sm:text-6xl'
    },
    // For help section titles
    'header-help': {
      'en': 'text-4xl sm:text-5xl',
      'ru': 'text-3xl sm:text-4xl',
      'kz': 'text-3xl sm:text-4xl'
    },
    // For marquee text
    'marquee': {
      'en': 'text-xl sm:text-3xl',
      'ru': 'text-lg sm:text-2xl',
      'kz': 'text-lg sm:text-2xl'
    }
  };

  return sizeMapping[baseSize]?.[locale] || sizeMapping[baseSize]?.['en'] || '';
};

export default function Home() {

  const t = useTranslations("Home"); 
  const locale = useLocale();

  const [textVisible, setTextVisible] = useState(false);
  const [subTextVisible, setSubTextVisible] = useState(false);
  const [butterflyAnim, setButterflyAnim] = useState(null);
  const [sunAnim, setSunAnim] = useState(null);
  const [visibleFeatures, setVisibleFeatures] = useState(0);
  const [visibleWhyUs, setVisibleWhyUs] = useState(0);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const whyUsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [playAnim, setPlayAnim] = useState(null);
  const [moveAnim, setMoveAnim] = useState(null);
  const [learnAnim, setLearnAnim] = useState(null);
  const [growAnim, setGrowAnim] = useState(null);
  const [arrowAnim, setArrowAnim] = useState(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");
  

useEffect(() => {
  fetch("/lottie/arrow.json")
    .then(res => res.json())
    .then(setArrowAnim);
}, []); 
  

useEffect(() => {
  fetch("/lottie/play.json").then(res => res.json()).then(setPlayAnim);
  fetch("/lottie/move.json").then(res => res.json()).then(setMoveAnim);
  fetch("/lottie/learn.json").then(res => res.json()).then(setLearnAnim);
  fetch("/lottie/grow.json").then(res => res.json()).then(setGrowAnim);
}, []);


  useEffect(() => {
    const mainTimer = setTimeout(() => setTextVisible(true), 500);
    const subTimer = setTimeout(() => setSubTextVisible(true), 1200);

    const container = marqueeRef.current;
    let scrollAmount = 0;
    const speed = 0.5;
    let paused = false;

    const handleMouseEnter = () => (paused = true);
    const handleMouseLeave = () => (paused = false);

    const scroll = () => {
      if (!paused && container) {
        scrollAmount += speed;
        container.scrollLeft = scrollAmount;
        if (scrollAmount >= container.scrollWidth - container.clientWidth) {
          scrollAmount = 0;
        }
      }
      requestAnimationFrame(scroll);
    };

    container?.addEventListener("mouseenter", handleMouseEnter);
    container?.addEventListener("mouseleave", handleMouseLeave);

    scroll();
    return () => {
      clearTimeout(mainTimer);
      clearTimeout(subTimer);
      container?.removeEventListener("mouseenter", handleMouseEnter);
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    fetch("/lottie/main_butterfly.json")
      .then((res) => res.json())
      .then(setButterflyAnim);
    fetch("/lottie/sun.json")
      .then((res) => res.json())
      .then(setSunAnim);
  }, []);
  useEffect(() => {
    const onScroll = () => {
      featureRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.85) {
          setVisibleFeatures((prev) => Math.max(prev, i + 1));
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      whyUsRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.85) {
          setVisibleWhyUs((prev) => Math.max(prev, i + 1));
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const whyUs = [
    {
      title: t("whyUs1title"),
      text: t("whyUs1text"),
    },
    {
      title: t("whyUs2title"),
      text: t("whyUs2text"),
    },
    {
      title: t("whyUs3title"),
      text: t("whyUs3text"),
    },
    {
      title: t("whyUs4title"),
      text: t("whyUs4text"),
    },
  ];
  const reviews = [
    {
      text: t("review1text"),
      author: t("review1author"),
      color: "#2959BF",
    },
    {
      text: t("review2text"),
      author: t("review2author"),
      color: "#34A853",
    },
    {
      text: t("review3text"),
      author: t("review3author"),
      color: "#7E44A1",
    },
    {
      text: t("review4text"),
      author: t("review4author"),
      color: "#F9DB63",
    },
    {
      text: t("review5text"),
      author: t("review5author"),
      color: "#FFB1B1",
    }
  ];
  const features = [
    {
      title: t("features1title"),
      text: t("features1text"),
    },
    {
      title: t("features2title"),
      text: t("features2text"),
    },
    {
      title: t("features3title"),
      text: t("features3text"),
    },
    {
      title: t("features4title"),
      text: t("features4text"),
    }
  ];
  
  const gameImages = [
  
    "/bubble-pop.png",
    "/tennis.png",
    "/fruit-slicer.png",  
    "/rockpaper.png",  
  ];
  const [familyAnim, setFamilyAnim] = useState(null);

useEffect(() => {
  fetch("/lottie/family.json")
    .then(res => res.json())
    .then(setFamilyAnim);
}, []);

const [kidAnim, setKidAnim] = useState(null);

useEffect(() => {
  fetch("/lottie/happy_boy.json")
    .then((res) => res.json())
    .then(setKidAnim);
}, []);

const [isLangOpen, setIsLangOpen] = useState(false);
  const [language, setLanguage] = useState(locale.toUpperCase());

  const router = useRouter();
  const pathname = usePathname();

  const handleLangChange = (lang: string) => {
    const nextLocale = lang.toLowerCase();
    setLanguage(lang);
    setIsLangOpen(false);

    router.replace(
      { pathname },
      { locale: nextLocale as Locale }
    );
  };



  return (
    <>
       <div
      className="relative w-full min-h-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: 'url("/background_hero.jpg")', 
      }}
    > 
    <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4">
  
  <Link href={"/"}>
  <div>
    <Image src="/svg/samga_bj.svg" alt="Samga Logo" width={120} height={40} />
  </div>
  </Link>
  
  <ul className="flex gap-15 px-15 py-3 bg-white rounded-full shadow-lg items-center relative text-black text-xl">
      <li>
        <Link href="#why-us" scroll={true} className="hover:underline">
          {t("navbar_about")}
        </Link>
      </li>
      <li>
        <Link href="/whowehelp" className="hover:underline">
          {t("navbar_whohelp")}
        </Link>
      </li>

      {/* Dropdown Start */}
      <li className="relative group">
        <div className="cursor-pointer hover:underline">
          {t("skills_devolop")}
        </div>
        <ul className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <li>
            <Link
              href="/skills/cognitive"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {t("skills_cognitive")}
            </Link>
          </li>
          <li>
            <Link
              href="/skills/motoric"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {t("skills_motoric")}
            </Link>
          </li>
        </ul>
      </li>
      {/* Dropdown End */}

      <li>
        <Link href="#footer" scroll={true} className="hover:underline">
          {t("contact_us")}
        </Link>
      </li>
      <li>
        <Link href="/register" className="hover:underline">
          {t("signup")}
        </Link>
      </li>
      <li>
        <Link href="/login" className="hover:underline">
          {t("login")}
        </Link>
      </li>
    </ul>


  
  <div className="flex items-center gap-3">
    
  <div className="relative">
      <button
        onClick={() => setIsLangOpen(!isLangOpen)}
        className="border border-black rounded-full px-3 py-4 text-xl flex items-center gap-1 font-medium text-black hover:bg-black hover:text-white transition mr-7"
      >
        <Globe className="w-4 h-4" />
        {language}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isLangOpen && (
        <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-24 z-50">
          {["EN", "RU", "KZ"].map((lang) => (
            <li
              key={lang}
              onClick={() => handleLangChange(lang)}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {lang}
            </li>
          ))}
        </ul>
      )}
    </div>


  </div>
</div>

      <Lottie
        animationData={kidAnim}
        loop
        className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 z-10"
      />

      
      <div className="relative z-20 pt-48 px-6 text-center flex flex-col items-center">
        <h1
          className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-main')} text-white font-extrabold transition-all duration-700 ease-out ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {t("header1")}
        </h1>
        <h1
          className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-main')} text-white font-extrabold transition-all duration-700 ease-out delay-300 ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
         {t("header2")}
        </h1>
        <h1
          className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-main')} text-white font-extrabold transition-all duration-700 ease-out delay-500 ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          
        </h1>
        <p
          className={`mt-6 text-white text-lg sm:text-xl max-w-xl transition-all duration-700 ease-out delay-700 ${
            subTextVisible ? "opacity-100" : "opacity-0"
          }`}
        >
         {t("header_paragraph")}
        </p>
        <Link href="/login">
        <button
          className={`mt-10 px-6 py-3 bg-white text-[#F49B00] rounded-full text-lg font-semibold hover:bg-gray-200 transition-all duration-700 ease-out delay-1000 transition-transform transform hover:scale-110 hover:bg-blue-700 duration-300${
            subTextVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {t("try_now")}
        </button>
        </Link>
      </div>
    </div>
  
      
    
<div id = 'why-us' className=" bg-[#FFF5E1] py-24 px-6 sm:px-10">
        <h2 className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-section')} font-bold text-center text-[#5C3E00] mb-12`}>{t("whyUs_title")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {whyUs.map((item, index) => (
            <div
              key={index}
              ref={(el) => {
                whyUsRefs.current[index] = el;
              }}
              className={`bg-white rounded-3xl p-6 shadow-xl transform transition-all duration-700 ease-out ${
                visibleWhyUs > index ? "opacity-100 scale-100" : "opacity-0 scale-95"
              } flex flex-col items-center text-center gap-4 border-4 border-dashed border-[#FFD966]`}
            >
              <div className="text-4xl">{item.title.split(" ")[0]}</div>
              <h3 className="text-xl font-bold text-[#333]">{item.title.replace(/^\S+\s/, "")}</h3>
              <p className="text-sm text-[#666]">{item.text}</p>
            </div>
          ))}
        </div>
       
      </div>


      <div className="overflow-hidden w-screen -mx-4">

      <section className="bg-[#FFF6E2] py-16 space-y-12 overflow-x-hidden w-screen">

        {/* Top Marquee */}
        <Marquee speed={60} gradient={false} className="-rotate-2 w-full">
          {gameImages.concat(gameImages).map((src, i) => (
            <div
              key={`top-${i}`}
              className="mx-4 rounded-3xl shadow-2xl overflow-hidden w-[260px] h-[160px] shrink-0"
            >
              <Image
                src={src}
                alt={`Game ${i}`}
                width={260}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </Marquee>

        {/* Bottom Marquee reverse */}
        <Marquee speed={60} gradient={false} direction="right" className="-rotate-2 w-full">
          {gameImages.concat(gameImages).map((src, i) => (
            <div
              key={`bottom-${i}`}
              className="mx-4 rounded-3xl shadow-2xl overflow-hidden w-[260px] h-[160px] shrink-0"
            >
              <Image
                src={src}
                alt={`Game ${i}`}
                width={260}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </Marquee>
      </section>
      </div>
     
      <section className="w-full font-quicksand">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
    {[
      {
        title: t("card1_title"),
        text: t("card1_text"),
        image: "/1.png",
      },
      {
        title: t("card2_title"),
        text: t("card2_text"),
        image: "/2.png",
      },
      {
        title: t("card3_title"),
        text: t("card3_text"),
        image: "/3.png",
      },
      {
        title: t("card4_title"),
        text: t("card4_text"),
        image: "/4.png",
      },
    ].map((card, idx) => (
      <div key={idx} className="flex flex-col items-center text-center w-full">
        {/* Image Section */}
        <div className="relative w-full h-[600px]">
          <Image
            src={card.image}
            alt={card.title}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover"
          />
        </div>

        
        <div
          className={`w-full px-6 pt-16 pb-10 flex flex-col justify-between ${
            idx % 2 === 0 ? "bg-[#2959BF] text-white" : "bg-white text-[#2959BF]"
          }`}
          style={{ transform: "none", scale: "1" ,  height: "350px"}}
        >
          <h3 className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-card')} font-bold mb-4`}>{card.title}</h3>
          <p className="text-base sm:text-lg mb-6 leading-relaxed">{card.text}</p>

          <Link href="/product">
            <button
              className={`px-6 py-3 text-base rounded-full font-semibold transition ${
                idx % 2 === 0
                  ? "bg-[#F9DB63] hover:bg-yellow-400 text-[#2959BF]"
                  : "bg-[#2959BF] hover:bg-[#1e4da6] text-white"
              }`}
            >
              {t("learn_more")}
            </button>
          </Link>
        </div>
      </div>
    ))}
  </div>
</section>



      

      <div className="bg-[#FFF5E1] py-24 px-6 sm:px-10 space-y-14">
      {features.map((feature, index) => (
  <div
    key={index}
    ref={(el) => {
      featureRefs.current[index] = el;
    }}
    className={`flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl mx-auto opacity-0 transform transition-all duration-1000 ease-out ${
    visibleFeatures > index
      ? index % 2 === 0
        ? "opacity-100 translate-x-0 animate-slide-left"
        : "opacity-100 translate-x-0 animate-slide-right"
      : "translate-y-12"
    }`}
  >
    {(index % 2 === 0 ? (
      <>
        
        <div className="w-[400px] h-[400px]">
          {index === 0 && playAnim && <Lottie animationData={playAnim} loop />}
          {index === 1 && moveAnim && <Lottie animationData={moveAnim} loop />}
          {index === 2 && learnAnim && <Lottie animationData={learnAnim} loop />}
          {index === 3 && growAnim && <Lottie animationData={growAnim} loop />}
        </div>
        <div className="text-left">
          <h3 className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-feature')} font-bold text-[#333] mb-4`}>{feature.title}</h3>
          <p className="text-2xl text-[#444] max-w-xl">{feature.text}</p>
        </div>
      </>
    ) : (
      <>
        <div className="text-left">
          <h3 className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-feature')} font-bold text-[#333] mb-4`}>{feature.title}</h3>
          <p className="text-2xl text-[#444] max-w-xl">{feature.text}</p>
        </div>
        <div className="w-[400px] h-[400px]">
          {index === 0 && playAnim && <Lottie animationData={playAnim} loop />}
          {index === 1 && moveAnim && <Lottie animationData={moveAnim} loop />}
          {index === 2 && learnAnim && <Lottie animationData={learnAnim} loop />}
          {index === 3 && growAnim && <Lottie animationData={growAnim} loop />}
        </div>
      </>
    ))}
  </div>
))}
</div>
      
      
      <div className="bg-purple-500 py-2">
  <Marquee speed={100} gradient={false}>
    <span className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'marquee')} mx-6 text-white font-bold`}>{t("enjoy_move")}</span>
  </Marquee>
</div>




<div id='reviews' className="py-20 bg-[#FFF6E2] w-full mb-24">
  <h2 className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-reviews')} font-bold text-center text-[#694800] mb-2 whitespace-pre-line`}>
    {t("reviews_title")}
  </h2>
  {familyAnim && (
  <div className="flex justify-center">
    <Lottie
      animationData={familyAnim}
      loop
      className="w-full max-w-5xl h-[300px] mb-5"
    />
  </div>
)}

  
  <div className="max-w-7xl mx-auto overflow-hidden ">

    <div
      ref={marqueeRef}
      className="flex gap-6 whitespace-nowrap overflow-hidden w-full"
    >
      {[...reviews, ...reviews].map((review, index) => (
       <div
       key={index}
       className="rounded-2xl min-w-[360px] sm:min-w-[420px] w-[420px] flex-shrink-0 p-6 shadow-lg flex flex-col justify-between whitespace-normal break-words"
       style={{ backgroundColor: review.color }}
     >
       <div className="text-3xl text-white mb-4">"</div>
       <div className="text-lg sm:text-xl font-semibold text-white">{review.text}</div>
       <div className="mt-6 font-bold text-white">{review.author}</div>
       <div className="mt-2 text-yellow-400 text-lg">★★★★★</div>
     </div>
   
      ))}
      

    </div>
  </div>
</div>
<section className="bg-[#FFF6E2] py-16 space-y-12 overflow-x-hidden w-screen -rotate-2 -mb-12">
  
  <Marquee speed={60} gradient={false} className="rotate-[4deg]">
    {gameImages.concat(gameImages).map((src, i) => (
      <div
        key={`top-alt-${i}`}
        className="mx-4 rounded-3xl shadow-2xl overflow-hidden w-[260px] h-[160px] shrink-0"
      >
        <Image
          src={src}
          alt={`Game ${i}`}
          width={260}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
    ))}
  </Marquee>

  
  <Marquee speed={60} gradient={false} direction="right" className="rotate-[4deg]">
    {gameImages.concat(gameImages).map((src, i) => (
      <div
        key={`bottom-alt-${i}`}
        className="mx-4 rounded-3xl shadow-2xl overflow-hidden w-[260px] h-[160px] shrink-0"
      >
        <Image
          src={src}
          alt={`Game ${i}`}
          width={260}
          height={160}
          className="object-cover w-full h-full"
        />
      </div>
    ))}
  </Marquee>
</section>


      <section className="w-full bg-[#FFF6E2] py-20 px-6 flex justify-center items-center">
  <div className="w-full max-w-7xl bg-[#FDE68A] rounded-3xl shadow-lg border-4 border-[#F59E0B] flex flex-col md:flex-row items-start p-10 gap-8">
    
    <div className="w-full md:w-1/2">
      <h2 className={`${getFontClass(locale)} ${getFontSizeClass(locale, 'header-help')} font-bold text-[#5C3E00] mb-6 leading-tight whitespace-pre-line`}>
         {t("help_you_title")}
      </h2>
      <div className="flex justify-end">
  <div className="w-56 h-56">
    <Lottie animationData={arrowAnim} loop autoplay />
  </div>
</div>


    </div>

    
    <div className="w-full md:w-1/2 space-y-6">
  {[
    {
      text: t("help1_text"),
      button: t("button1_text"),
      color: "bg-[#3B82F6] text-white",
      link: "/login",
    },
    {
      text: t("help2_text"),
      button: t("button2_text"),
      color: "bg-[#3B82F6] text-white",
      link: "mailto:merei.zhazitova@gmail.com",
    },
    {
      text: t("help3_text"),
      button: t("button3_text"),
      color: "bg-white text-black border border-black",
      link: "mailto:merei.zhazitova@gmail.com", // example email
    },
    {
      text: t("help4_text"),
      button: t("button4_text"),
      color: "bg-white text-black border border-black",
      link: "mailto:merei.zhazitova@gmail.com", // or whatever your route is
    },
  ].map((item, idx) => (
    <div
      key={idx}
      className="flex justify-between items-center border-b border-[#5C3E00] pb-4"
    >
      <p className="text-md sm:text-lg font-medium text-[#5C3E00] w-2/3">
        {item.text}
      </p>
      {item.link?.startsWith("mailto:") ? (
        <a
          href={item.link}
          className={`ml-4 px-4 py-2 rounded-full font-semibold whitespace-nowrap ${item.color} hover:scale-105 transition`}
        >
          {item.button} →
        </a>
      ) : (
        <Link href={item.link ?? "#"}>
          <button
            className={`ml-4 px-4 py-2 rounded-full font-semibold whitespace-nowrap ${item.color} hover:scale-105 transition`}
          >
            {item.button} →
          </button>
        </Link>
      )}
    </div>
  ))}
</div>
  </div>
</section>


    </>
  );
}