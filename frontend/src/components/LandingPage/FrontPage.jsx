import React from 'react'
import Hero from './Hero'
import Features from './Features'
import Modules from './Modules'
import SampleDashboard from './SampleDashboard'
import CTA from './CTA'

function FrontPage() {
  return (
    <div className='md:ml-64'>
      <Hero />
      <Features />
      <Modules />
      <SampleDashboard />
      <CTA />
    </div>
  )
}

export default FrontPage
