import LoginForm from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0E8] dark:bg-slate-950 px-4 py-8 transition-colors duration-300">
      <LoginForm />
    </main>
  );
}