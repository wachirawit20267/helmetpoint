import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0E8] dark:bg-slate-950 px-4 py-8 transition-colors duration-300">
      <RegisterForm />
    </main>
  );
}