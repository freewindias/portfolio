import { getCertificates } from "@/server/certificates";

const Certificates = async () => {
  const certificatesToRender = await getCertificates();

  if (!certificatesToRender || certificatesToRender.length === 0) return null;

  return (
    <section>
      <div className="container">
        <div className="border-x border-border">
          <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
            <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
              <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                Certificates & Publications
              </p>
            </div>
          </div>

          <div className="border-t border-border">
            <div className="relative max-w-3xl mx-auto px-4 sm:px-0 py-10">
              <div className="hidden sm:flex absolute left-5 sm:left-[15.9rem] sm:translate-x-1/2 top-0 bottom-0 w-px bg-primary/10" />

              <div className="relative">
                {certificatesToRender?.map((item: any, index: any) => (
                  <div
                    key={index}
                    className={`relative flex flex-col sm:flex-row sm:items-start gap-4 ${
                      index !== certificatesToRender.length - 1 ? "mb-8 sm:mb-16" : ""
                    }`}
                  >
                    <div className="relative pl-8 sm:pl-0 sm:w-64 sm:text-right sm:pr-16">
                      <p className="ml-2.5 sm:ml-0 text-base font-normal sm:mb-0 leading-relaxed">
                        {item.date}
                      </p>

                      {/* Bullet Point */}
                      <div className="absolute left-1.5 sm:left-auto sm:-right-3 top-0 z-10 p-1.5 border border-border rounded-full bg-white">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-1 sm:pl-10 ml-2 sm:ml-0">
                      <h5 className="font-semibold">{item.title}</h5>
                      <p className="text-primary">{item.subtitle}</p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-fit inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-primary hover:text-primary/70 transition-colors border border-primary/20 px-2 py-0.5 rounded-sm"
                        >
                          View
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M7 7h10v10" />
                            <path d="M7 17 17 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
