"use client"

import React, { useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/utils/supabase/client'

function LoginContent() {
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const redirectToParam = searchParams.get('redirect')

  const handleGoogleLogin = async () => {
    setLoading('google')
    const supabase = createClient()
    
    // Construct the callback URL with the next parameter if available
    const callbackUrl = new URL(`${window.location.origin}/auth/callback`)
    if (redirectToParam) {
      callbackUrl.searchParams.set('next', redirectToParam)
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
      },
    })

    if (error) {
      alert(`Erro ao fazer login com Google: ${error.message}`)
      setLoading(null)
    }
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-start md:justify-center bg-[#050810] selection:bg-[#1565FF]/30 pt-28 pb-12">
      {/* Header / Navbar */}
      <header className="absolute top-0 w-full z-20 flex items-center justify-between px-6 py-6 md:py-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#1565FF] rounded-xl shadow-[0_0_25px_rgba(21,101,255,0.4)] transform rotate-12 transition-transform hover:rotate-0 duration-300">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white -rotate-12" fill="currentColor">
              <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display font-black text-xl md:text-2xl uppercase tracking-tighter text-white">
            Gol Mais Bonito
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-10">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors duration-200">Home</Link>
          <Link href="#" className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors duration-200">Candidatos</Link>
          <Link href="#" className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors duration-200">Votação</Link>
        </nav>
      </header>

      {/* Login Card Container */}
      <section className="relative z-10 w-full max-w-[480px] px-4 md:px-0 flex flex-col items-center">
        <div className="w-full bg-[#111827]/85 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden">

          {/* Internal Glow Effect */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#1565FF]/10 blur-[100px] rounded-full" />

          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl md:text-3xl font-display font-black mb-2 tracking-tighter text-white">
              Bem-vindo
            </h1>
            <p className="text-sm text-[#94A3B8] max-w-[340px] mx-auto font-medium leading-relaxed opacity-90">
              Faça login para votar nos melhores lances da temporada.
            </p>
          </div>

          <div className="flex flex-col gap-4 mb-2 relative z-10 w-full max-w-[320px] mx-auto">
            <Button 
              variant="social" 
              disabled={!!loading}
              onClick={handleGoogleLogin}
              className="w-full h-14 rounded-2xl gap-3 text-sm font-bold border-white/10 bg-white/[0.04] transition-all hover:bg-white/[0.08] hover:border-white/20 active:scale-95 text-white"
            >
              {loading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 48 48" className="shrink-0">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                  </svg>
                  Continuar com Google
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-8 text-center relative z-10 max-w-[300px] mx-auto">
            <p className="text-[11px] font-medium text-[#64748B] leading-relaxed">
              Ao continuar, você concorda com nossos{' '}
              <Link href="#" className="text-[#94A3B8] hover:text-white transition-colors underline decoration-white/20 underline-offset-2">Termos de Uso</Link>
              {' '}e{' '}
              <Link href="#" className="text-[#94A3B8] hover:text-white transition-colors underline decoration-white/20 underline-offset-2">Política de Privacidade</Link>.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="mt-12 text-center space-y-4 px-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[11px] text-[#64748B] font-medium tracking-wide">
            &copy; 2024 Gol Mais Bonito. Todos os direitos reservados.
          </p>
          <div className="flex items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.1em] text-[#64748B]">
            <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
        </footer>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen w-full flex items-center justify-center bg-[#050810]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1565FF]" />
      </main>
    }>
      <LoginContent />
    </Suspense>
  )
}
