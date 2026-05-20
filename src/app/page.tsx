import { HomePage } from "@/components/sections/home/HomePage/HomePage";
import { UnauthorizedToast } from "@/components/sections/admin/UnauthorizedToast/UnauthorizedToast";
import { getServerFocaccias } from "@/services/FocacciaServerService";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, initialFocaccias] = await Promise.all([
    searchParams,
    getServerFocaccias(),
  ]);

  return (
    <>
      <HomePage initialFocaccias={initialFocaccias} />
      <UnauthorizedToast error={error} />
    </>
  );
}
