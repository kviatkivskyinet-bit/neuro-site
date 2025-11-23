import { NextResponse } from 'next/server';
import crypto from 'crypto';

const MERCHANT_LOGIN = process.env.NEXT_PUBLIC_WAYFORPAY_MERCHANT;
const MERCHANT_SECRET = process.env.WAYFORPAY_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!MERCHANT_LOGIN || !MERCHANT_SECRET) {
        return NextResponse.json({ error: 'Merchant config missing' }, { status: 500 });
    }

    const { merchantDomainName, orderReference, orderDate, amount, currency, productName, productCount, productPrice } = body;

    const signatureString = [
      MERCHANT_LOGIN, merchantDomainName, orderReference, orderDate, String(amount), currency,
      productName.join(';'), productCount.join(';'), productPrice.join(';')
    ].join(';');

    const signature = crypto.createHmac('md5', MERCHANT_SECRET).update(signatureString).digest('hex');

    return NextResponse.json({ signature });
  } catch (error) {
    return NextResponse.json({ error: 'Signature failed' }, { status: 500 });
  }
}
