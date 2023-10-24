'use client'
import { useState, useEffect } from 'react'
import ProModal from './pro-modal'

const ModalProvider = () => {

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div>
      <ProModal />
    </div>
  )
}
export default ModalProvider