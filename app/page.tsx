import { redirect } from 'next/navigation';

export default function Page() {
  // Redirigir a login
  redirect('/auth/login');
}
