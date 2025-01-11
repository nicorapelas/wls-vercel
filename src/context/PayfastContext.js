import createDataContext from './createDataContext'
import ngrokApi from '../api/ngrok'

const payfastReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true }
    case 'CLEAR_LOADING':
      return { ...state, loading: false }
    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload, loading: false }
    case 'CLEAR_ERROR':
      return { ...state, errorMessage: null }
    case 'SET_PAYMENT_DATA':
      return { ...state, paymentData: action.payload, loading: false }
    case 'CLEAR_PAYMENT_DATA':
      return { ...state, paymentData: null }
    case 'SET_CONFIRM_PURCHASE':
      return { ...state, confirmPurchase: action.payload }
    case 'SET_PAYMENT_TRIGGERED':
      return { ...state, paymentTriggered: action.payload }
    case 'SET_PAYMENT_HISTORY':
      return { ...state, paymentHistory: action.payload }
    case 'SET_ALL_PAYMENT_HISTORY':
      return { ...state, allPaymentHistory: action.payload, loading: false }
    case 'SET_USER_OF_PAYMENT':
      return { ...state, userOfPayment: action.payload, loading: false }
    case 'SET_USER_OF_PAYMENT_PROPS':
      return { ...state, userOfPaymentProps: action.payload }
    default:
      return state
  }
}

const clearError = (dispatch) => () => {
  dispatch({ type: 'CLEAR_ERROR' })
}

const initiatePayment = (dispatch) => async (paymentDetails) => {
  try {
    const response = await ngrokApi.post(
      '/payment/create-payment',
      paymentDetails,
    )
    // Don't parse as JSON, just return the raw response
    return response
  } catch (error) {
    console.error('Payment initiation failed:', error)
    throw error
  }
}

const setPaymentTriggered = (dispatch) => (value) => {
  dispatch({ type: 'SET_PAYMENT_TRIGGERED', payload: value })
}

const clearPaymentData = (dispatch) => () => {
  dispatch({ type: 'CLEAR_PAYMENT_DATA' })
}

const setConfirmPurchase = (dispatch) => (value) => {
  dispatch({ type: 'SET_CONFIRM_PURCHASE', payload: value })
}

const fetchPaymentHistory = (dispatch) => async (ownerId) => {
  const response = await ngrokApi.post('/payment/fetch-purchase-history', {
    ownerId,
  })
  dispatch({ type: 'SET_PAYMENT_HISTORY', payload: response.data })
}

// Admin actoins
const fetchAllPaymentHistory = (dispatch) => async () => {
  dispatch({ type: 'SET_LOADING' })
  const response = await ngrokApi.get('/payment/fetch-all-payments')
  dispatch({ type: 'SET_ALL_PAYMENT_HISTORY', payload: response.data })
}

const fetchUserOfPayment = (dispatch) => async (userId) => {
  dispatch({ type: 'SET_LOADING' })
  const response = await ngrokApi.post('/payment/fetch-user-of-payment', {
    userId,
  })
  dispatch({ type: 'SET_USER_OF_PAYMENT', payload: response.data })
}

const setUserOfPaymentProps = (dispatch) => (props) => {
  dispatch({ type: 'SET_USER_OF_PAYMENT_PROPS', payload: props })
}

export const { Context, Provider } = createDataContext(
  payfastReducer,
  {
    clearError,
    initiatePayment,
    clearPaymentData,
    setConfirmPurchase,
    setPaymentTriggered,
    fetchPaymentHistory,
    fetchAllPaymentHistory,
    fetchUserOfPayment,
    setUserOfPaymentProps,
  },
  {
    loading: false,
    errorMessage: null,
    paymentData: null,
    confirmPurchase: false,
    paymentTriggered: false,
    paymentHistory: [],
    allPaymentHistory: [],
    userOfPayment: null,
    userOfPaymentProps: null,
  },
)
