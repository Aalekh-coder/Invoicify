import React from 'react'
import Container from './Container'

const Footer = () => {
  return (
      <footer className='mt-12 mb-8'>
          <Container className='flex justify-between gap-4'>
              <p className="text-sm">
                  InVoicify &copy; {new Date().getFullYear()}
              </p>
              <p className="text-sm">
                  Create by Aalekh with nextjs and clerk
              </p>
          </Container>
    </footer>
  )
}

export default Footer