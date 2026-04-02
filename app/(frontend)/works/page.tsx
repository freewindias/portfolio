"use client";

import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import Divider from "../_components/divider";

const WorksPage = () => {
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
                    className={`group flex flex-col gap-3.5 sm:gap-5 p-3.5 sm:p-6 ${isRightCol ? "md:border-l md:border-border" : ""} ${!isLastRow ? "border-b border-border" : ""}`}
                  >
                    <Link href={`/works/${value.slug}`} className="overflow-hidden">
                      <Image
                        src={value.image}
                        alt="Image"
                        width={490}
                        height={300}
                        className="w-full h-full group-hover:scale-105 transition-all duration-300 ease-in-out"
                      />
                    </Link>
                    <div className="flex flex-col gap-1 sm:gap-2 px-2">
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
