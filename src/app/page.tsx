import { HomePage } from "@/components/HomePage/HomePage";
import { UnauthorizedToast } from "@/components/UnauthorizedToast/UnauthorizedToast";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <HomePage />
      <UnauthorizedToast error={error} />
    </>
  );
}
