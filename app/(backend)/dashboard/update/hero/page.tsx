import { getHeroData } from "@/server/hero";
import { HeroForm } from "../../../_components/update-data/hero-form";

export default async function Page() {
  const initialData = await getHeroData();

  return (
    <div className="px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hero Section</h1>
        <p className="text-muted-foreground">
          Update your banner, profile picture, and personal information.
        </p>
      </div>
      <HeroForm initialData={initialData} />
    </div>
  );
}
