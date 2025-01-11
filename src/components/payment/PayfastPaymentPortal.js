import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Context as PayfastContext } from '../../context/PayfastContext'
import { Context as CardsContext } from '../../context/CardsContext'
import './payfastPaymentPortal.css'

const PayfastPaymentPortal = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formRef] = useState(React.createRef())

  const {
    state: { confirmPurchase, paymentTriggered },
    initiatePayment,
    setConfirmPurchase,
    setPaymentTriggered,
  } = useContext(PayfastContext)

  const {
    state: { cardToBuy },
    setCardToBuy,
  } = useContext(CardsContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      let timer = setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [loading])

  useEffect(() => {
    console.log('confirmPurchase changed:', confirmPurchase)
    console.log('cardToBuy:', cardToBuy)

    if (confirmPurchase && cardToBuy) {
      console.log('Setting paymentTriggered to true')
      setPaymentTriggered(true)
    }
  }, [confirmPurchase, cardToBuy])

  useEffect(() => {
    console.log('paymentTriggered changed:', paymentTriggered)
    if (paymentTriggered) {
      console.log('Calling handleConfirmedPurchase')
      handleConfirmedPurchase()
    }
  }, [paymentTriggered])

  const handleConfirmedPurchase = async () => {
    setPaymentTriggered(false)
    const { productCode, price } = cardToBuy
    try {
      await handlePayment(productCode, price)
    } finally {
      setCardToBuy(null)
      setConfirmPurchase(false)
    }
  }

  const handlePayment = async (productCode, price) => {
    console.log('Starting payment with:', { productCode, price })

    try {
      setLoading(true)
      setError(null)

      const response = await initiatePayment({
        amountInCents: price,
        currency: 'ZAR',
        productCode: productCode,
        description: `Purchase of ${productCode}`,
      })

      // Get the HTML response as text
      const html = await response.text()

      // Create a new window and write the HTML
      const newWindow = window.open()
      if (newWindow) {
        newWindow.document.write(html)
      } else {
        setError('Pop-up blocked. Please allow pop-ups for this site.')
      }

      setLoading(false)
    } catch (error) {
      console.error('Payment error:', error)
      setError(error.message || 'Failed to initialize payment')
      setLoading(false)
    }
  }

  return (
    <div className="payment-container">
      <h2>Make Payment</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="payment-status">{loading ? 'Processing...' : ''}</div>
    </div>
  )
}

export default PayfastPaymentPortal
