import { redirect } from 'next/navigation';

export default function LoginPage() {
  // Redirigir directo al dashboard
  redirect('/dashboard');
}
