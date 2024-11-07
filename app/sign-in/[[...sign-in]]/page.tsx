import Container from "@/components/Container";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <Container>
      <SignIn />
    </Container>
  );
}
