import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

// Este es un comentario de prueba para BugBot
export default async function HomePage() {
  const jar = await cookies()
  const hasJwt = Boolean(jar.get('jwt')?.value)
  redirect(hasJwt ? '/dashboard' : '/login')
}
