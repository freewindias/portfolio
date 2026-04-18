import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/server/projects";
import { Button } from "@/components/ui/button";
import Divider from "../_components/divider";

const WorksPage = async () => {
  const projects = await getProjects();

  return (
    <main className="min-h-screen">
      <Divider/>
      <section>
        <div className="container">
          <div className="border-x border-border">
            <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
              <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
                <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                  All Works
                </p>
                <Button
                  variant={"outline"}
                  className="h-auto py-3 px-5"
                  nativeButton={false}
                  render={<Link href={"/"}>Back to Home</Link>}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-border">
              {projects.map((value, index) => {
                const isRightCol = index % 2 === 1;
                const isLastRow = index >= projects.length - (projects.length % 2 === 0 ? 2 : 1);

                return (
                  <div
                    key={index}
                    className={`group flex flex-col ${isRightCol ? "md:border-l md:border-border" : ""} ${!isLastRow ? "border-b border-border" : ""}`}
                  >
                    <div className="p-3.5 sm:p-6">
                      <Link href={`/works/${value.slug}`} className="overflow-hidden block">
                        <Image
                          src={value.image || "/images/placeholder.png"}
                          alt="Image"
                          width={390}
                          height={490}
                          className="w-full h-[490px] object-contain group-hover:scale-105 transition-all duration-300 ease-in-out"
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
      <Divider />
    </main>
  );
};

export default WorksPage;
