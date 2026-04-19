import { NextResponse } from 'next/server'
// The client you created in Step 1
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/campeonatos'

  // Determinar a origem de forma robusta para produção (especialmente atrás de proxies)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const host = forwardedHost ?? request.headers.get('host') ?? requestUrl.host
  const protocol = forwardedProto ?? (requestUrl.protocol === 'https:' ? 'https' : 'http')
  const origin = `${protocol}://${host}`

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}
