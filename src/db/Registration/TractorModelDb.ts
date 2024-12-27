import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'TractorModelTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

export const setupTractorModelDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tractormodel'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS tractormodel', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS tractormodel (id INTEGER PRIMARY KEY AUTOINCREMENT, makeID INTEGER, modelID INTEGER, modelName TEXT, modelARC TEXT)',
              [],
              () => console.log('Table tractormodel created successfully'),
              (error) => console.error('Error creating tractormodel table:', error)
            );
          }
        },
        (error) => console.error('Error checking/creating table:', error)
      );
    });
  } catch (error) {
    console.error('Transaction error:', error);
  }
};

export const getAllTractorModelItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tractormodel',
        [],
        (tx, results) => {
          const tractorModels = [];
          for (let i = 0; i < results.rows.length; ++i) {
            tractorModels.push(results.rows.item(i));
          }
          resolve(tractorModels);
        },
        (error) => {
          console.error('Error fetching tractor models:', error);
          reject(error);
        }
      );
    });
  });
};

export const getmodelid = async (model_id) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM tractormodel WHERE modelID = ?',
        [model_id],
        (tx, results) => {
          const tractorModels = [];
          for (let i = 0; i < results.rows.length; ++i) {
            tractorModels.push(results.rows.item(i));
          }
          resolve(tractorModels);
        },
        (error) => {
          console.error('Error fetching tractor model by ID:', error);
          reject(error);
        }
      );
    });
  });
};

export const getVehicleModelByVehTypeid = async (makeID) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT modelName, modelID FROM tractormodel WHERE makeID = ?',
        [makeID],
        (tx, results) => {
          const tractorModels = [];
          for (let i = 0; i < results.rows.length; ++i) {
            tractorModels.push(results.rows.item(i));
          }
          resolve(tractorModels);
        },
        (error) => {
          console.error('Error fetching vehicle models by makeID:', error);
          reject(error);
        }
      );
    });
  });
};

export const insertTractorModelItems = async (items) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      items.forEach(item => {
        tx.executeSql(
          'INSERT INTO tractormodel (makeID, modelID, modelName) VALUES (?, ?, ?)',
          [item.makeID, item.modelID, item.modelName],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Inserted successfully');
            } else {
              console.log('Failed to insert');
            }
          },
          (error) => {
            console.error('Error executing SQL:', error);
            reject(error);
          }
        );
      });
      resolve();
    }, (transactionError) => {
      console.error('SQLite transaction error:', transactionError.message);
      reject(transactionError);
    }, () => {
      console.log('Transaction complete');
    });
  });
};

export const clearTractorModelTable = (tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(`DELETE FROM ${tableName}`, [], (_, result) => {
        resolve(result);
      }, (_, error) => {
        reject(error);
      });
    });
  });
};

export default { setupTractorModelDatabase, getAllTractorModelItems, insertTractorModelItems, clearTractorModelTable, getVehicleModelByVehTypeid, getmodelid };
