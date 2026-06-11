export const printOrder = (order) => {
  const printWindow = window.open('', '', 'width=600,height=800');
  
  const itemsList = order.items
    .map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">
          ${item.name}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
          x${item.quantity}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">
          ₹${item.price * item.quantity}
        </td>
      </tr>
    `)
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
          }
          .receipt {
            max-width: 400px;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .order-number {
            font-size: 18px;
            font-weight: bold;
            color: #FF8C42;
            margin: 10px 0;
          }
          table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
          }
          th {
            text-align: left;
            padding: 8px;
            border-bottom: 2px solid #000;
          }
          .total-section {
            margin-top: 20px;
            border-top: 2px solid #000;
            padding-top: 10px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 18px;
            font-weight: bold;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>BITEFY</h1>
            <p>Order Receipt</p>
          </div>
          
          <div class="order-number">
            ${order.name}
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Total:</span>
              <span>₹${order.total}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your order!</p>
            <p>Please keep this receipt</p>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.print();
};