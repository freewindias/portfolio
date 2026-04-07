
import Image from "next/image";

const experienceData = [
  {
    icon: "/images/icon/tailwind-icon.svg",
    role: "Product Designer, Tailwind",
    location: "Remote",
    startYear: "2022",
    endYear: "Present",
    bulletPoints: [
      "Led end-to-end redesign of dashboard UI, improving user retention by 23%",
      "Collaborated with engineers and product managers to ship features faster",
      "Designed components used in a system adopted by 4+ internal teams"
    ]
  },
  {
    icon: "/images/icon/asana-icon.svg",
    role: "IT Support - Our Lady of Nazareth School",
    location: "Mumbai, IN",
    startYear: "2019",
    endYear: "2022",
    bulletPoints: [
      "Created design systems for client projects across finance and healthcare",
      "Conducted user testing and research to validate designs",
      "Helped junior designers grow via mentorship",
    ]
  },
];


const Experience = () => {

  return (
    <section>
      <div className="container">
        <div className="border-x border-border">
          <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
            <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
              <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                Experience
              </p>
            </div>
          </div>
          <div className="border-t border-border">
            <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-9 md:py-16 ">
              {experienceData?.map((value: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-5 border-dashed border-b border-border last:border-b-0 pt-8 sm:pt-10 pb-8 sm:pb-10 first:pt-0 last:pb-0"
                  >
                    <Image
                      src={value?.icon}
                      alt="icon"
                      width={30}
                      height={30}
                    />
                    <div className="flex flex-wrap gap-5 items-center justify-between">
                      <h5>{value?.role}</h5>
                      <div className="flex items-center gap-2.5 border border-border rounded-lg py-1.5 px-3">
                        <div
                          className={`w-4 h-2 rounded-sm ${value?.endYear == "Present" ? "bg-primary" : "bg-primary/10"} `}
                        />
                        <p className="text-sm xs:text-base text-primary">
                          {value?.startYear} – {value?.endYear} ·{" "}
                          {value?.location}
                        </p>
                      </div>
                    </div>
                    <ul>
                      {value?.bulletPoints?.map((point: any, index: any) => {
                        return (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-base font-normal text-muted-foreground"
                          >
                            <span className="w-2.5 h-2.5 text-muted-foreground">
                              •
                            </span>
                            {point}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
