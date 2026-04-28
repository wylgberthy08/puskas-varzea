import { NextResponse } from 'next/server'
// The client you created in Step 1
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/campeonatos'

  // Determinar a origem de forma robusta para produção
  // O split(',')[0] garante que pegamos o primeiro host se houver múltiplos proxies
  const host = request.headers.get('x-forwarded-host')?.split(',')[0] ?? 
               request.headers.get('host') ?? 
               requestUrl.host
  
  // Forçamos https em produção se não estivermos no localhost
  const protocol = request.headers.get('x-forwarded-proto')?.split(',')[0] ?? 
                   (host.includes('localhost') ? 'http' : 'https')
  
  const origin = `${protocol}://${host}`

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // new URL(next, origin) garante um redirecionamento seguro seja 'next' um path ou URL completo
      return NextResponse.redirect(new URL(next, origin).toString())
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL(`/login?error=auth-code-error`, origin).toString())
}

