export const VNP_CONFIG = {
  tmnCode: process.env.VNP_TMN_CODE || '2QXUI4J4',
  hashSecret: process.env.VNP_HASH_SECRET || 'SECRET_KEY_HERE',
  url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  api: 'https://sandbox.vnpayment.vn/merchant_webapi/api.merchant',
  returnUrl: 'http://localhost:3000/api/v1/payment/vnpay-return',
  ipnUrl: 'https://your-domain.com/api/v1/payment/vnpay-ipn',
};
