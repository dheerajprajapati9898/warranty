import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({
      name: 'OldTyreCompanyTable.db',
      location: 'default',
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupOldTyreCompanyDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='oldtyrecompany'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS oldtyrecompany', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS oldtyrecompany (id INTEGER PRIMARY KEY AUTOINCREMENT, tyre_company_Id INTEGER, tyre_company_name TEXT)',
              [],
            );
          }
        },
        error => {
          console.log('Error checking/creating table:', error);
        },
      );
    });
  } catch (error) {
    console.error('Transaction error:', error);
  }
};

// Function to fetch all items from the database
export const getAllOldTyreCompanyItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM oldtyrecompany',
        [],
        (tx, results) => {
          const states = [];
          for (let i = 0; i < results.rows.length; ++i) {
            states.push(results.rows.item(i));
          }
          resolve(states);
        },
        error => {
          console.error('Error fetching states:', error);
          reject(error);
        },
      );
    });
  });
};

// Function to insert multiple items into the database
export const insertOldTyreCompanyItems = async items => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(
    tx => {
      items.forEach(item => {
        tx.executeSql(
          'INSERT INTO oldtyrecompany (tyre_company_Id , tyre_company_name) VALUES (?,?)',
          [item.tyre_company_Id, item.tyre_company_name],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Inserted successfully');
            } else {
              console.log('Failed to insert');
            }
          },
          error => {
            console.log('Error executing SQL:', error);
          },
        );
      });
    },
    transactionError => {
      console.error('SQLite transaction error:', transactionError.message);
    },
    () => {
      console.log('Transaction complete');
    },
  );
};

export const clearOldTyreCompanyTable = tableName => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM ${tableName}`,
        [],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
};
export default {
  setupOldTyreCompanyDatabase,
  getAllOldTyreCompanyItems,
  insertOldTyreCompanyItems,
  clearOldTyreCompanyTable,
};
