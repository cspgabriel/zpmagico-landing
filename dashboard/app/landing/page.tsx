'use client'

import { useState } from 'react'
import Hero from '@/components/landing/Hero'
import SocialProof from '@/components/landing/SocialProof'
import Problem from '@/components/landing/Problem'
import Features from '@/components/landing/Features'
import Integrations from '@/components/landing/Integrations'
import HowItWorks from '@/components/landing/HowItWorks'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="bg-white">
      <Hero />
      <SocialProof />
      <Problem />
      <Features />
      <Integrations />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
