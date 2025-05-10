import { loadTossPayments } from '@tosspayments/payment-sdk'

// clientKey는 toss에서 제공하는 테스트키입니다.
const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq'

// key와 함께 tosspayments를 초기화합니다.
const tossPayments = await loadTossPayments(clientKey)

export default tossPayments;