import { NextResponse } from 'next/server'
// The client you created in Step 1
import { createClient } from '@/utils/supabase/server'
import { getURL } from '@/utils/url'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/campeonatos'

  // Determinar a origem de forma robusta
  const origin = getURL().replace(/\/$/, '') // Remove trailing slash if present for URL constructor

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

