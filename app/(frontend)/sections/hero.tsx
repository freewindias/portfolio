import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiMail, FiDownload, FiMapPin } from "react-icons/fi";

const HeroSection = ({ heroData }: { heroData: any }) => {
  const name = heroData?.name || "Freewin Dias";
  const role = heroData?.role || "Game & Web Developer";
  const location = heroData?.location || "Vancouver, BC";
  const bannerUrl = heroData?.bannerUrl || "/images/hero-sec/banner-bg-img.png";
  const profileUrl = heroData?.profileUrl || "/images/hero-sec/user-img.png";
  
  const mailEmail = heroData?.mailEmail || "mailto:[EMAIL_ADDRESS]";
  const linkedinUrl = heroData?.linkedinUrl || "https://linkedin.com/in/freewindias";
  const githubUrl = heroData?.githubUrl || "https://github.com/freewindias";
  const resumeUrl = heroData?.resumeUrl || "/resume.pdf";

  const socialIcons = [
    {
      icon: <FiMail size={20} />,
      href: mailEmail.startsWith("mailto:") ? mailEmail : `mailto:${mailEmail}`,
      name: "Mail",
    },
    {
      icon: <FaLinkedinIn size={20} />,
      href: linkedinUrl,
      name: "LinkedIn",
      target: "_blank",
    },
    {
      icon: <FaGithub size={20} />,
      href: githubUrl,
      name: "GitHub",
      target: "_blank",
    },
  ];

  return (
    <section>
      <div className="container">
        <div className="">
          <div className="w-full h-72 relative">
            <Image
              src={bannerUrl}
              alt="banner-img"
              fill
              priority
              sizes="100vw"
              className="object-cover border-x border-border"
            />
          </div>
          <div className="border-x border-border">
            <div className="relative flex flex-col xs:flex-row items-center xs:items-start justify-center xs:justify-between max-w-3xl mx-auto gap-10 xs:gap-3 px-4 sm:px-7 pt-22 pb-8 sm:pb-12">
              <div className="absolute top-0 transform -translate-y-1/2">
                <Image
                  src={profileUrl}
                  alt="user-img"
                  width={145}
                  height={145}
                  className="border-4 border-white rounded-full bg-white"
                  priority
                />
                <span className="absolute bottom-2.5 right-5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 items-center text-center xs:items-start">
                <h1>{name}</h1>
                <p className="text-violet-700 font-normal">
                  {role}
                </p>
                <div className="flex items-center gap-2">
                  <FiMapPin size={20} />
                  <p className="text-primary">{location}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  {socialIcons?.map((value: any, index: number) => {
                    return (
                      <Link
                        href={value?.href}
                        key={index}
                        target={value.target}
                        rel={value.target === "_blank" ? "noopener noreferrer" : undefined}
                        className="w-fit p-2.5 sm:p-3.5 hover:bg-primary/5 border border-border rounded-full transition-colors"
                        title={value.name}
                      >
                        {value.icon}
                      </Link>
                    );
                  })}
                </div>
                <Button className="h-auto rounded-full p-0">
                  <Link
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block p-0.5 rounded-full bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)]"
                  >
                    <span className="flex items-center gap-3 bg-primary hover:bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] py-2.5 px-5 rounded-full transition-colors">
                      <FiDownload size={28} className="text-white" />
                      <span className="text-sm sm:text-base font-semibold text-white">
                        Resume
                      </span>
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
