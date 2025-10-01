const { sequelize } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Criar backup manual
const createBackup = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../../backups');
    const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

    // Criar diretório se não existir
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir, { recursive: true });
    }

    // Exportar dados como SQL
    const tables = await sequelize.getQueryInterface().showAllTables();
    let sqlDump = `-- Backup criado em ${new Date().toISOString()}\n\n`;

    for (const table of tables) {
      // Pular tabelas de sistema do Sequelize
      if (table === 'SequelizeMeta') continue;

      const [results] = await sequelize.query(`SELECT * FROM "${table}"`);
      
      if (results.length > 0) {
        sqlDump += `-- Dados da tabela ${table}\n`;
        
        for (const row of results) {
          const columns = Object.keys(row).join(', ');
          const values = Object.values(row).map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
            if (v instanceof Date) return `'${v.toISOString()}'`;
            return v;
          }).join(', ');
          
          sqlDump += `INSERT INTO "${table}" (${columns}) VALUES (${values});\n`;
        }
        
        sqlDump += `\n`;
      }
    }

    // Salvar arquivo
    await fs.writeFile(backupFile, sqlDump, 'utf8');

    res.json({
      success: true,
      data: {
        filename: `backup-${timestamp}.sql`,
        size: (await fs.stat(backupFile)).size,
        tables_count: tables.length,
        created_at: new Date()
      }
    });

  } catch (error) {
    console.error('Erro ao criar backup:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Listar backups disponíveis
const listBackups = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../../backups');

    try {
      await fs.access(backupDir);
    } catch {
      return res.json({
        success: true,
        data: []
      });
    }

    const files = await fs.readdir(backupDir);
    const backups = await Promise.all(
      files
        .filter(f => f.endsWith('.sql'))
        .map(async (file) => {
          const filePath = path.join(backupDir, file);
          const stats = await fs.stat(filePath);
          
          return {
            filename: file,
            size: stats.size,
            created_at: stats.birthtime
          };
        })
    );

    // Ordenar por data (mais recente primeiro)
    backups.sort((a, b) => b.created_at - a.created_at);

    res.json({
      success: true,
      data: backups
    });

  } catch (error) {
    console.error('Erro ao listar backups:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Download de backup
const downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const backupFile = path.join(__dirname, '../../backups', filename);

    // Verificar se arquivo existe
    await fs.access(backupFile);

    res.download(backupFile);

  } catch (error) {
    console.error('Erro ao baixar backup:', error);
    res.status(404).json({
      success: false,
      error: 'Arquivo não encontrado'
    });
  }
};

// Estatísticas do banco
const getDatabaseStats = async (req, res) => {
  try {
    const tables = await sequelize.getQueryInterface().showAllTables();
    const stats = [];

    for (const table of tables) {
      if (table === 'SequelizeMeta') continue;

      const [count] = await sequelize.query(`SELECT COUNT(*) as count FROM "${table}"`);
      
      stats.push({
        table: table,
        records: parseInt(count[0].count)
      });
    }

    // Total de registros
    const totalRecords = stats.reduce((sum, s) => sum + s.records, 0);

    res.json({
      success: true,
      data: {
        tables_count: stats.length,
        total_records: totalRecords,
        tables: stats
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createBackup,
  listBackups,
  downloadBackup,
  getDatabaseStats
};

