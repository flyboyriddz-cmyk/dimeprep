import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalCheckoutProps {
  totalAmount: number;
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
}

export const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({ totalAmount, onSuccess, onError }) => {
  return (
    <div className="w-full min-h-[150px] relative z-10" style={{ isolation: 'isolate' }}>
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
        forceReRender={[totalAmount]}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: totalAmount.toFixed(2), 
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            try {
              const details = await actions.order.capture();
              console.log('Payment Successful', details);
              onSuccess(details);
            } catch (error) {
              console.error("PayPal Capture Error:", error);
              if (onError) onError(error);
            }
          }
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          if (onError) onError(err);
        }}
      />
    </div>
  );
};