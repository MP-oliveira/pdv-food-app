const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class RealtimeService {
  /**
   * Enviar notificação de novo pedido para cozinha
   */
  static async notifyNewOrder(orderData) {
    try {
      await supabase
        .channel('kitchen-orders')
        .send({
          type: 'broadcast',
          event: 'new-order',
          payload: {
            order_id: orderData.id,
            order_number: orderData.order_number,
            items: orderData.items,
            table: orderData.table,
            created_at: orderData.created_at
          }
        });
    } catch (error) {
      console.error('Erro ao enviar notificação de pedido:', error);
    }
  }

  /**
   * Atualizar status do pedido
   */
  static async updateOrderStatus(orderId, status) {
    try {
      await supabase
        .channel('kitchen-orders')
        .send({
          type: 'broadcast',
          event: 'order-status-updated',
          payload: {
            order_id: orderId,
            status,
            updated_at: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
    }
  }

  /**
   * Notificar estoque baixo
   */
  static async notifyLowStock(productData) {
    try {
      await supabase
        .channel('notifications')
        .send({
          type: 'broadcast',
          event: 'low-stock',
          payload: {
            product_id: productData.id,
            product_name: productData.name,
            current_quantity: productData.current_quantity,
            min_quantity: productData.min_quantity
          }
        });
    } catch (error) {
      console.error('Erro ao enviar notificação de estoque:', error);
    }
  }

  /**
   * Notificar pagamento processado
   */
  static async notifyPaymentProcessed(paymentData) {
    try {
      await supabase
        .channel('payments')
        .send({
          type: 'broadcast',
          event: 'payment-processed',
          payload: {
            order_id: paymentData.order_id,
            amount: paymentData.amount,
            method: paymentData.payment_method,
            processed_at: paymentData.processed_at
          }
        });
    } catch (error) {
      console.error('Erro ao enviar notificação de pagamento:', error);
    }
  }
}

module.exports = RealtimeService;
