import Container from "@/components/Container";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <Container>
      <SignUp />
    </Container>
  );
}