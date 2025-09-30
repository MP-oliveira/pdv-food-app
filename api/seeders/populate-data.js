const { sequelize } = require('../config/database');
const { Category, Product, Stock, Table } = require('../models');

async function populateData() {
  try {
    console.log('🌱 Iniciando população do banco de dados...');

    // Criar categorias
    const categories = await Category.bulkCreate([
      {
        name: 'Bebidas',
        description: 'Bebidas em geral',
        color: '#3B82F6',
        sort_order: 1,
        is_active: true
      },
      {
        name: 'Pratos Principais',
        description: 'Pratos principais do cardápio',
        color: '#10B981',
        sort_order: 2,
        is_active: true
      },
      {
        name: 'Sobremesas',
        description: 'Sobremesas e doces',
        color: '#F59E0B',
        sort_order: 3,
        is_active: true
      },
      {
        name: 'Aperitivos',
        description: 'Aperitivos e entradas',
        color: '#EF4444',
        sort_order: 4,
        is_active: true
      },
      {
        name: 'Saladas',
        description: 'Saladas e pratos leves',
        color: '#8B5CF6',
        sort_order: 5,
        is_active: true
      },
      {
        name: 'Pizzas',
        description: 'Pizzas artesanais',
        color: '#EC4899',
        sort_order: 6,
        is_active: true
      },
      {
        name: 'Pastéis',
        description: 'Pastéis diversos',
        color: '#06B6D4',
        sort_order: 7,
        is_active: true
      },
      {
        name: 'Porções',
        description: 'Porções para compartilhar',
        color: '#84CC16',
        sort_order: 8,
        is_active: true
      }
    ], { ignoreDuplicates: true });

    console.log('✅ Categorias criadas:', categories.length);

    // Buscar categorias criadas
    const bebidas = await Category.findOne({ where: { name: 'Bebidas' } });
    const pratos = await Category.findOne({ where: { name: 'Pratos Principais' } });
    const sobremesas = await Category.findOne({ where: { name: 'Sobremesas' } });
    const aperitivos = await Category.findOne({ where: { name: 'Aperitivos' } });
    const saladas = await Category.findOne({ where: { name: 'Saladas' } });
    const pizzas = await Category.findOne({ where: { name: 'Pizzas' } });
    const pasteis = await Category.findOne({ where: { name: 'Pastéis' } });
    const porcoes = await Category.findOne({ where: { name: 'Porções' } });

    // Criar produtos
    const products = await Product.bulkCreate([
      // BEBIDAS
      {
        name: 'Coca-Cola 600ml',
        description: 'Refrigerante Coca-Cola gelado',
        price: 8.50,
        cost_price: 4.00,
        category_id: bebidas.id,
        barcode: '7891234567890',
        sku: 'COCA600',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 1
      },
      {
        name: 'Fanta Lata 310ml',
        description: 'Refrigerante Fanta Laranja',
        price: 5.50,
        cost_price: 2.50,
        category_id: bebidas.id,
        barcode: '7891234567891',
        sku: 'FANTA310',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 2
      },
      {
        name: 'Guaraná Antarctica Lata',
        description: 'Refrigerante Guaraná Antarctica',
        price: 5.50,
        cost_price: 2.50,
        category_id: bebidas.id,
        barcode: '7891234567892',
        sku: 'GUARA310',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 3
      },
      {
        name: 'Pepsi Lata 310ml',
        description: 'Refrigerante Pepsi',
        price: 5.50,
        cost_price: 2.50,
        category_id: bebidas.id,
        barcode: '7891234567893',
        sku: 'PEPSI310',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 4
      },
      {
        name: 'Coca-Cola Lata 310ml',
        description: 'Refrigerante Coca-Cola',
        price: 5.50,
        cost_price: 2.50,
        category_id: bebidas.id,
        barcode: '7891234567894',
        sku: 'COCA310',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 5
      },
      {
        name: 'Fanta Uva Lata 310ml',
        description: 'Refrigerante Fanta Uva',
        price: 5.50,
        cost_price: 2.50,
        category_id: bebidas.id,
        barcode: '7891234567895',
        sku: 'FANTAUVA310',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 6
      },
      {
        name: 'Pepsi 300ml',
        description: 'Refrigerante Pepsi',
        price: 5.50,
        cost_price: 2.50,
        category_id: bebidas.id,
        barcode: '7891234567896',
        sku: 'PEPSI300',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 7
      },
      {
        name: 'Sprite Lata 310ml',
        description: 'Refrigerante Sprite',
        price: 5.50,
        cost_price: 2.50,
        category_id: bebidas.id,
        barcode: '7891234567897',
        sku: 'SPRITE310',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 8
      },
      {
        name: 'Água Mineral 500ml',
        description: 'Água mineral natural',
        price: 3.50,
        cost_price: 1.50,
        category_id: bebidas.id,
        barcode: '7891234567898',
        sku: 'AGUA500',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 9
      },
      {
        name: 'Suco de Laranja 300ml',
        description: 'Suco natural de laranja',
        price: 7.50,
        cost_price: 3.50,
        category_id: bebidas.id,
        barcode: '7891234567899',
        sku: 'SUCOLAR300',
        preparation_time: 5,
        is_available: true,
        is_digital: false,
        sort_order: 10
      },

      // PRATOS PRINCIPAIS
      {
        name: 'X-Burger Picanha',
        description: 'Hambúrguer de picanha com queijo, alface, tomate e molho especial',
        price: 24.90,
        cost_price: 12.00,
        category_id: pratos.id,
        barcode: '7891234567900',
        sku: 'XBURGERPIC',
        preparation_time: 15,
        is_available: true,
        is_digital: false,
        sort_order: 1
      },
      {
        name: 'X-Bacon',
        description: 'Hambúrguer com bacon crocante, queijo, alface e tomate',
        price: 22.90,
        cost_price: 11.00,
        category_id: pratos.id,
        barcode: '7891234567901',
        sku: 'XBACON',
        preparation_time: 12,
        is_available: true,
        is_digital: false,
        sort_order: 2
      },
      {
        name: 'X-Tudo',
        description: 'Hambúrguer completo com tudo: carne, bacon, ovo, queijo, alface, tomate',
        price: 28.90,
        cost_price: 14.00,
        category_id: pratos.id,
        barcode: '7891234567902',
        sku: 'XTUDO',
        preparation_time: 18,
        is_available: true,
        is_digital: false,
        sort_order: 3
      },
      {
        name: 'Frango Grelhado',
        description: 'Peito de frango grelhado com arroz, feijão e salada',
        price: 19.90,
        cost_price: 9.50,
        category_id: pratos.id,
        barcode: '7891234567903',
        sku: 'FRANGOGRIL',
        preparation_time: 20,
        is_available: true,
        is_digital: false,
        sort_order: 4
      },
      {
        name: 'Bife à Parmegiana',
        description: 'Bife empanado com molho de tomate e queijo derretido',
        price: 26.90,
        cost_price: 13.00,
        category_id: pratos.id,
        barcode: '7891234567904',
        sku: 'BIFEPARM',
        preparation_time: 25,
        is_available: true,
        is_digital: false,
        sort_order: 5
      },

      // PIZZAS
      {
        name: 'Pizza Margherita',
        description: 'Pizza com molho de tomate, mussarela e manjericão',
        price: 32.90,
        cost_price: 16.00,
        category_id: pizzas.id,
        barcode: '7891234567905',
        sku: 'PIZZAMARG',
        preparation_time: 30,
        is_available: true,
        is_digital: false,
        sort_order: 1
      },
      {
        name: 'Pizza Portuguesa',
        description: 'Pizza com presunto, ovos, cebola, azeitona e mussarela',
        price: 38.90,
        cost_price: 19.00,
        category_id: pizzas.id,
        barcode: '7891234567906',
        sku: 'PIZZAPORT',
        preparation_time: 30,
        is_available: true,
        is_digital: false,
        sort_order: 2
      },
      {
        name: 'Pizza Calabresa',
        description: 'Pizza com calabresa, cebola e mussarela',
        price: 35.90,
        cost_price: 18.00,
        category_id: pizzas.id,
        barcode: '7891234567907',
        sku: 'PIZZACALAB',
        preparation_time: 30,
        is_available: true,
        is_digital: false,
        sort_order: 3
      },
      {
        name: 'Pizza Quatro Queijos',
        description: 'Pizza com mussarela, gorgonzola, parmesão e catupiry',
        price: 42.90,
        cost_price: 21.00,
        category_id: pizzas.id,
        barcode: '7891234567908',
        sku: 'PIZZA4QUEI',
        preparation_time: 30,
        is_available: true,
        is_digital: false,
        sort_order: 4
      },

      // PASTÉIS
      {
        name: 'Pastel de Carne',
        description: 'Pastel frito com recheio de carne moída temperada',
        price: 8.90,
        cost_price: 4.00,
        category_id: pasteis.id,
        barcode: '7891234567909',
        sku: 'PASTELCARNE',
        preparation_time: 8,
        is_available: true,
        is_digital: false,
        sort_order: 1
      },
      {
        name: 'Pastel de Queijo',
        description: 'Pastel frito com recheio de queijo derretido',
        price: 7.90,
        cost_price: 3.50,
        category_id: pasteis.id,
        barcode: '7891234567910',
        sku: 'PASTELQUEIJO',
        preparation_time: 8,
        is_available: true,
        is_digital: false,
        sort_order: 2
      },
      {
        name: 'Pastel de Frango',
        description: 'Pastel frito com recheio de frango desfiado',
        price: 8.90,
        cost_price: 4.00,
        category_id: pasteis.id,
        barcode: '7891234567911',
        sku: 'PASTELFRANGO',
        preparation_time: 8,
        is_available: true,
        is_digital: false,
        sort_order: 3
      },
      {
        name: 'Pastel de Pizza',
        description: 'Pastel frito com recheio de pizza (molho, queijo e presunto)',
        price: 9.90,
        cost_price: 4.50,
        category_id: pasteis.id,
        barcode: '7891234567912',
        sku: 'PASTELPIZZA',
        preparation_time: 8,
        is_available: true,
        is_digital: false,
        sort_order: 4
      },

      // SOBREMESAS
      {
        name: 'Pudim de Leite',
        description: 'Pudim caseiro com calda de caramelo',
        price: 12.90,
        cost_price: 6.00,
        category_id: sobremesas.id,
        barcode: '7891234567913',
        sku: 'PUDIMLEITE',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 1
      },
      {
        name: 'Brigadeiro',
        description: 'Brigadeiro caseiro com granulado',
        price: 3.50,
        cost_price: 1.50,
        category_id: sobremesas.id,
        barcode: '7891234567914',
        sku: 'BRIGADEIRO',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 2
      },
      {
        name: 'Beijinho',
        description: 'Beijinho caseiro com coco ralado',
        price: 3.50,
        cost_price: 1.50,
        category_id: sobremesas.id,
        barcode: '7891234567915',
        sku: 'BEIJINHO',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 3
      },
      {
        name: 'Açaí 300ml',
        description: 'Açaí cremoso com granola e banana',
        price: 15.90,
        cost_price: 8.00,
        category_id: sobremesas.id,
        barcode: '7891234567916',
        sku: 'ACAI300',
        preparation_time: 5,
        is_available: true,
        is_digital: false,
        sort_order: 4
      },
      {
        name: 'Sorvete Napolitano',
        description: 'Sorvete de chocolate, morango e baunilha',
        price: 8.90,
        cost_price: 4.00,
        category_id: sobremesas.id,
        barcode: '7891234567917',
        sku: 'SORVNAPOL',
        preparation_time: 0,
        is_available: true,
        is_digital: false,
        sort_order: 5
      },

      // APERITIVOS
      {
        name: 'Batata Frita',
        description: 'Porção de batata frita crocante',
        price: 12.90,
        cost_price: 6.00,
        category_id: aperitivos.id,
        barcode: '7891234567918',
        sku: 'BATATAFRITA',
        preparation_time: 10,
        is_available: true,
        is_digital: false,
        sort_order: 1
      },
      {
        name: 'Coxinha',
        description: 'Coxinha de frango com catupiry',
        price: 6.90,
        cost_price: 3.00,
        category_id: aperitivos.id,
        barcode: '7891234567919',
        sku: 'COXINHA',
        preparation_time: 5,
        is_available: true,
        is_digital: false,
        sort_order: 2
      },
      {
        name: 'Kibe',
        description: 'Kibe frito com recheio de carne',
        price: 5.90,
        cost_price: 2.50,
        category_id: aperitivos.id,
        barcode: '7891234567920',
        sku: 'KIBE',
        preparation_time: 5,
        is_available: true,
        is_digital: false,
        sort_order: 3
      },
      {
        name: 'Bolinha de Queijo',
        description: 'Bolinha frita com recheio de queijo',
        price: 7.90,
        cost_price: 3.50,
        category_id: aperitivos.id,
        barcode: '7891234567921',
        sku: 'BOLINHAQUEIJO',
        preparation_time: 5,
        is_available: true,
        is_digital: false,
        sort_order: 4
      },

      // SALADAS
      {
        name: 'Salada Caesar',
        description: 'Salada com alface, croutons, queijo parmesão e molho caesar',
        price: 18.90,
        cost_price: 9.00,
        category_id: saladas.id,
        barcode: '7891234567922',
        sku: 'SALADACAESAR',
        preparation_time: 8,
        is_available: true,
        is_digital: false,
        sort_order: 1
      },
      {
        name: 'Salada Verde',
        description: 'Salada mista com alface, rúcula, tomate e pepino',
        price: 15.90,
        cost_price: 7.50,
        category_id: saladas.id,
        barcode: '7891234567923',
        sku: 'SALADAVERDE',
        preparation_time: 5,
        is_available: true,
        is_digital: false,
        sort_order: 2
      },
      {
        name: 'Salada de Frango',
        description: 'Salada com frango grelhado, alface, tomate e cenoura',
        price: 22.90,
        cost_price: 11.00,
        category_id: saladas.id,
        barcode: '7891234567924',
        sku: 'SALADAFRANGO',
        preparation_time: 10,
        is_available: true,
        is_digital: false,
        sort_order: 3
      },

      // PORÇÕES
      {
        name: 'Porção de Frango a Passarinho',
        description: 'Porção de frango em pedaços pequenos frito',
        price: 28.90,
        cost_price: 14.00,
        category_id: porcoes.id,
        barcode: '7891234567925',
        sku: 'PORCAOFRANGO',
        preparation_time: 20,
        is_available: true,
        is_digital: false,
        sort_order: 1
      },
      {
        name: 'Porção de Batata Frita',
        description: 'Porção grande de batata frita',
        price: 18.90,
        cost_price: 9.00,
        category_id: porcoes.id,
        barcode: '7891234567926',
        sku: 'PORCAOBATATA',
        preparation_time: 15,
        is_available: true,
        is_digital: false,
        sort_order: 2
      },
      {
        name: 'Porção de Mandioca',
        description: 'Porção de mandioca frita',
        price: 16.90,
        cost_price: 8.00,
        category_id: porcoes.id,
        barcode: '7891234567927',
        sku: 'PORCAOMANDIOCA',
        preparation_time: 15,
        is_available: true,
        is_digital: false,
        sort_order: 3
      },
      {
        name: 'Porção Mista',
        description: 'Porção com batata frita, mandioca e frango a passarinho',
        price: 35.90,
        cost_price: 18.00,
        category_id: porcoes.id,
        barcode: '7891234567928',
        sku: 'PORCAOMISTA',
        preparation_time: 25,
        is_available: true,
        is_digital: false,
        sort_order: 4
      }
    ], { ignoreDuplicates: true });

    console.log('✅ Produtos criados:', products.length);

    // Criar estoque para produtos não digitais
    const stockEntries = [];
    for (const product of products) {
      if (!product.is_digital && product.id) {
        stockEntries.push({
          product_id: product.id,
          current_quantity: Math.floor(Math.random() * 50) + 10, // 10-60 unidades
          min_quantity: 5,
          unit: 'unidade'
        });
      }
    }

    if (stockEntries.length > 0) {
      await Stock.bulkCreate(stockEntries, { ignoreDuplicates: true });
      console.log('✅ Estoque criado para', stockEntries.length, 'produtos');
    }

    // Criar mesas
    const tables = await Table.bulkCreate([
      { number: 1, name: 'Mesa 1', capacity: 4, location: 'Salão Principal', is_available: true },
      { number: 2, name: 'Mesa 2', capacity: 4, location: 'Salão Principal', is_available: true },
      { number: 3, name: 'Mesa 3', capacity: 6, location: 'Salão Principal', is_available: true },
      { number: 4, name: 'Mesa 4', capacity: 4, location: 'Salão Principal', is_available: true },
      { number: 5, name: 'Mesa 5', capacity: 2, location: 'Varanda', is_available: true },
      { number: 6, name: 'Mesa 6', capacity: 2, location: 'Varanda', is_available: true },
      { number: 7, name: 'Mesa 7', capacity: 8, location: 'Salão Principal', is_available: true },
      { number: 8, name: 'Mesa 8', capacity: 4, location: 'Salão Principal', is_available: true }
    ], { ignoreDuplicates: true });

    console.log('✅ Mesas criadas:', tables.length);

    console.log('🎉 População do banco concluída com sucesso!');
    console.log(`📊 Resumo:`);
    console.log(`   - ${categories.length} categorias`);
    console.log(`   - ${products.length} produtos`);
    console.log(`   - ${stockEntries.length} itens de estoque`);
    console.log(`   - ${tables.length} mesas`);

  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  populateData();
}

module.exports = populateData;
