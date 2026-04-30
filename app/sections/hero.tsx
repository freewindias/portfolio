import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiMail, FiDownload, FiMapPin } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

const HeroSection = ({ heroData }: { heroData: any }) => {
  const name = heroData?.name;
  const role = heroData?.role;
  const location = heroData?.location;
  const bannerUrl = heroData?.bannerUrl;
  const profileUrl = heroData?.profileUrl;

  const mailEmail = heroData?.mailEmail;
  const linkedinUrl = heroData?.linkedinUrl;
  const githubUrl = heroData?.githubUrl;
  const resumeUrl = heroData?.resumeUrl;

  const socialIcons = [
    {
      icon: <FiMail size={20} />,
      href: `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(mailEmail)}&su=${encodeURIComponent("Connect with Freewin Dias")}`,
      name: "Mail",
      target: "_blank",
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
                <Dialog>
                  <DialogTrigger className="relative cursor-pointer transition-transform hover:scale-105 outline-none border-none bg-transparent p-0 block">
                    <Image
                      src={profileUrl}
                      alt="user-img"
                      width={145}
                      height={145}
                      className="border-4 border-white rounded-full bg-white"
                      priority
                    />
                    <span className="absolute bottom-2.5 right-5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl border-none bg-transparent shadow-none p-0 flex justify-center [&>button]:text-white [&>button]:bg-black/50 [&>button]:rounded-full [&>button]:p-2 [&>button]:right-0 [&>button]:-top-12 sm:[&>button]:-right-12 sm:[&>button]:top-0">
                    <DialogTitle className="sr-only">
                      Profile Picture
                    </DialogTitle>
                    <div className="relative w-full max-w-md aspect-square border-none">
                      <Image
                        src={profileUrl}
                        alt="user-img-full"
                        fill
                        className="object-contain rounded-full shadow-2xl"
                        priority
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3 items-center text-center xs:items-start">
                <h1>{name}</h1>
                <p className="text-violet-700 font-normal">{role}</p>
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
                        rel={
                          value.target === "_blank"
                            ? "noopener noreferrer"
                            : undefined
                        }
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
