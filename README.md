# Edy's Baked Goods — Uncle Kek

Commerce-first website concept for Edy's Baked Goods.

## Included in this preview
- Heritage/editorial customer-facing website
- Responsive product catalogue
- Cart with local persistence
- Post vs Plaza Glomac pickup selection
- Checkout flow with FPX / DuitNow / Card options
- Bulk / corporate quotation flow
- GitHub Pages deployment workflow

## Important preview notes
- The current product prices are placeholders for the proposal preview and should be replaced with Edy's confirmed live prices.
- Some product images are visual placeholders. Existing Edy's Baked Goods brand assets can replace them after approval.
- The checkout intentionally does **not** charge real money. The `Teruskan Pembayaran` step is a front-end preview ready to be connected to the production payment API.
- Merchant transaction fees are not shown to customers. They belong in the merchant/payment configuration.

## Production payment architecture
Recommended flow:

1. Customer adds products to cart.
2. Checkout submits order to backend API.
3. Backend validates catalogue prices, stock and delivery fee.
4. Backend creates pending order in the shared commerce database.
5. Backend creates payment session with configured gateway.
6. Customer is redirected / presented with secure gateway payment.
7. Gateway webhook confirms payment server-to-server.
8. Order status changes to `paid` only after verified webhook.
9. Merchant dashboard receives the new paid order.

Never place production gateway secret keys in this static repository.

## Preview URL
GitHub Pages workflow publishes from `main` using GitHub Actions.
