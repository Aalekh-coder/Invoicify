import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = async () => {
  return (
    <main className="flex flex-col justify-center h-full text-center max-w-5xl mx-auto  gap-6">
      <h1 className="text-5xl font-bold">InVoicepedia</h1>
      <p>
        <Button asChild>
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </p>
    </main>
  );
};

export default Home;
