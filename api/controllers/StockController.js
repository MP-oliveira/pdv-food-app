const { Stock, Product, StockMovement, User } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Registrar movimentação de estoque
const recordMovement = async (req, res) => {
  try {
    const { product_id, type, quantity, reason, notes } = req.body;
    const user_id = req.user.id;

    // Buscar estoque atual
    const stock = await Stock.findOne({ where: { product_id } });
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        error: 'Estoque não encontrado para este produto'
      });
    }

    const previousQuantity = parseFloat(stock.current_quantity);
    let newQuantity;

    // Calcular nova quantidade baseado no tipo
    if (['IN', 'PURCHASE', 'PRODUCTION'].includes(type)) {
      newQuantity = previousQuantity + parseFloat(quantity);
    } else if (['OUT', 'SALE', 'WASTE'].includes(type)) {
      newQuantity = previousQuantity - parseFloat(quantity);
    } else if (type === 'ADJUSTMENT') {
      newQuantity = parseFloat(quantity); // Ajuste seta o valor absoluto
    }

    // Validar se tem estoque suficiente para saída
    if (newQuantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade insuficiente em estoque'
      });
    }

    // Criar movimentação
    const movement = await StockMovement.create({
      product_id,
      type,
      quantity: parseFloat(quantity),
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      reason,
      user_id,
      notes
    });

    // Atualizar estoque
    await stock.update({
      current_quantity: newQuantity,
      last_update: new Date()
    });

    // Verificar se está abaixo do mínimo
    const isLowStock = newQuantity <= parseFloat(stock.min_quantity || 0);

    res.json({
      success: true,
      data: movement,
      stock: {
        current_quantity: newQuantity,
        is_low: isLowStock
      }
    });

  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Baixar estoque de um pedido (quando finalizado)
const decreaseStockFromOrder = async (req, res) => {
  try {
    const { order_id, items } = req.body;
    const user_id = req.user.id;

    const movements = [];
    const lowStockProducts = [];

    // Processar cada item do pedido
    for (const item of items) {
      const stock = await Stock.findOne({ where: { product_id: item.product_id } });
      
      if (!stock) {
        continue;
      }

      const previousQuantity = parseFloat(stock.current_quantity);
      const newQuantity = previousQuantity - parseFloat(item.quantity);

      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          error: `Estoque insuficiente para ${item.name}`,
          product_id: item.product_id
        });
      }

      // Criar movimentação
      const movement = await StockMovement.create({
        product_id: item.product_id,
        type: 'SALE',
        quantity: parseFloat(item.quantity),
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        reason: `Venda - Pedido #${order_id}`,
        reference_type: 'order',
        reference_id: order_id,
        user_id
      });

      // Atualizar estoque
      await stock.update({
        current_quantity: newQuantity,
        last_update: new Date()
      });

      movements.push(movement);

      // Verificar estoque baixo
      if (newQuantity <= parseFloat(stock.min_quantity || 0)) {
        lowStockProducts.push({
          product_id: item.product_id,
          name: item.name,
          current: newQuantity,
          minimum: stock.min_quantity
        });
      }
    }

    res.json({
      success: true,
      data: movements,
      low_stock: lowStockProducts
    });

  } catch (error) {
    console.error('Erro ao baixar estoque:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Buscar histórico de movimentações
const getMovements = async (req, res) => {
  try {
    const { product_id, type, date_from, date_to, limit = 50 } = req.query;

    const where = {};
    
    if (product_id) where.product_id = product_id;
    if (type) where.type = type;
    
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = new Date(date_from);
      if (date_to) where.created_at[Op.lte] = new Date(date_to);
    }

    const movements = await StockMovement.findAll({
      where,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'sku']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: movements
    });

  } catch (error) {
    console.error('Erro ao buscar movimentações:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Verificar produtos com estoque baixo
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: Stock,
        as: 'stock',
        where: Sequelize.literal('"stock"."current_quantity" <= "stock"."min_quantity"'),
        required: true
      }],
      order: [[{ model: Stock, as: 'stock' }, 'current_quantity', 'ASC']]
    });

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Erro ao buscar produtos com estoque baixo:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Ajustar estoque (inventário)
const adjustStock = async (req, res) => {
  try {
    const { product_id, new_quantity, reason } = req.body;
    const user_id = req.user.id;

    const stock = await Stock.findOne({ where: { product_id } });
    
    if (!stock) {
      return res.status(404).json({
        success: false,
        error: 'Estoque não encontrado'
      });
    }

    const previousQuantity = parseFloat(stock.current_quantity);

    // Criar movimentação
    await StockMovement.create({
      product_id,
      type: 'ADJUSTMENT',
      quantity: parseFloat(new_quantity),
      previous_quantity: previousQuantity,
      new_quantity: parseFloat(new_quantity),
      reason: reason || 'Ajuste de inventário',
      user_id
    });

    // Atualizar estoque
    await stock.update({
      current_quantity: parseFloat(new_quantity),
      last_update: new Date()
    });

    res.json({
      success: true,
      data: {
        previous: previousQuantity,
        new: parseFloat(new_quantity)
      }
    });

  } catch (error) {
    console.error('Erro ao ajustar estoque:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Devolver estoque ao cancelar pedido
const returnStockFromOrder = async (req, res) => {
  try {
    const { order_id, items, cancel_reason } = req.body;
    const user_id = req.user.id;

    const movements = [];

    // Processar cada item do pedido cancelado
    for (const item of items) {
      const stock = await Stock.findOne({ where: { product_id: item.product_id } });
      
      if (!stock) {
        continue;
      }

      const previousQuantity = parseFloat(stock.current_quantity);
      const newQuantity = previousQuantity + parseFloat(item.quantity);

      // Criar movimentação de devolução
      const movement = await StockMovement.create({
        product_id: item.product_id,
        type: 'IN',
        quantity: parseFloat(item.quantity),
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        reason: `Devolução - Pedido #${order_id} cancelado: ${cancel_reason}`,
        reference_type: 'order_cancel',
        reference_id: order_id,
        user_id
      });

      // Atualizar estoque
      await stock.update({
        current_quantity: newQuantity,
        last_update: new Date()
      });

      movements.push(movement);
    }

    res.json({
      success: true,
      data: movements,
      message: 'Estoque devolvido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao devolver estoque:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Verificar disponibilidade de estoque
const checkStockAvailability = async (req, res) => {
  try {
    const { items } = req.body;

    const unavailableItems = [];

    for (const item of items) {
      const stock = await Stock.findOne({ 
        where: { product_id: item.product_id },
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'name']
        }]
      });

      if (!stock) {
        unavailableItems.push({
          product_id: item.product_id,
          name: item.name,
          reason: 'Produto sem controle de estoque',
          available: 0,
          requested: item.quantity
        });
        continue;
      }

      const available = parseFloat(stock.current_quantity);
      const requested = parseFloat(item.quantity);

      if (available < requested) {
        unavailableItems.push({
          product_id: item.product_id,
          name: item.name || stock.product?.name,
          reason: 'Estoque insuficiente',
          available,
          requested
        });
      }
    }

    res.json({
      success: true,
      available: unavailableItems.length === 0,
      unavailable_items: unavailableItems
    });

  } catch (error) {
    console.error('Erro ao verificar estoque:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  recordMovement,
  decreaseStockFromOrder,
  returnStockFromOrder,
  getMovements,
  getLowStockProducts,
  adjustStock,
  checkStockAvailability
};

