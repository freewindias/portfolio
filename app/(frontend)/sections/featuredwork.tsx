
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/server/projects";

const FeaturedWork = async () => {
  const projects = await getProjects();
  const featureWork = projects.filter(p => p.featured);

  return (
    <section>
      <div className="container">
        <div className="border-x border-border">
          <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
            <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
              <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                Featured work
              </p>
              <Button
                variant={"outline"}
                className="h-auto py-3 px-5"
                nativeButton={false}
                render={<Link href={"/works"}>View all my works!</Link>}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border">
            {featureWork?.map((value: any, index: number) => {
              const isRightCol = index % 2 === 1;
              const isLastRow = index >= featureWork.length - (featureWork.length % 2 === 0 ? 2 : 1);
              const isLastItem = index === featureWork.length - 1;
              const isOnlyOne = featureWork.length === 1;

              return (
                  <div
                    key={index}
                    className={`group flex flex-col border-b border-border ${isRightCol ? "" : "md:border-r md:border-border"} ${isLastItem && !isOnlyOne ? "border-b-0" : ""} ${isLastRow && !isOnlyOne ? "md:border-b-0" : ""}`}
                  >
                    <div className="p-3.5 sm:p-6">
                      <Link href={`/works/${value.slug}`} className="overflow-hidden block relative h-[300px] sm:h-[490px]">
                        <Image
                          src={value.image}
                          alt="Image"
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain group-hover:scale-105 transition-all duration-300 ease-in-out"
                        />
                      </Link>
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-2 px-[22px] sm:px-[32px] py-5 border-t border-border">
                      <Link href={`/works/${value.slug}`}>
                        <h4>{value.title}</h4>
                      </Link>
                      <div className="flex">
                        <p>{value.category}</p>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
