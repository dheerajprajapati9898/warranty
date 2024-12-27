import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({
      name: 'MasterSyncUpdateTable.db',
      location: 'default',
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupMasterSyncUpdateDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='mastersync'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS mastersync', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS mastersync (id INTEGER PRIMARY KEY AUTOINCREMENT, apiname TEXT, status BOOLEAN)',
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

// export const getStateid = async (statename: string) => {
//   if (!db) {
//     await openDB(); // Ensure the database is opened
//   }
//   return new Promise((resolve, reject) => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'SELECT * FROM states WHERE statename=?',
//         [statename],
//         (tx, results) => {
//           const states = [];
//           for (let i = 0; i < results.rows.length; ++i) {
//             states.push(results.rows.item(i));
//           }
//           resolve(states);
//         },
//         (error) => {
//           console.error('Error fetching states:', error);
//           reject(error);
//         }
//       );
//     });
//   });
// };
// Function to fetch all items from the database
export const getAllMasterSyncUpdateItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM mastersync',
        [],
        (tx, results) => {
          const mastersync = [];
          for (let i = 0; i < results.rows.length; ++i) {
            mastersync.push(results.rows.item(i));
          }
          resolve(mastersync);
        },
        error => {
          console.error('Error fetching mastersync:', error);
          reject(error);
        },
      );
    });
  });
};

export const insertMasterSyncUpdateItems = async items => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    items.forEach(item => {
      tx.executeSql(
        'INSERT INTO mastersync (apiname , status) VALUES (?,?)',
        [item.apiname, item.status],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Inserted successfully');
            getAllMasterSyncUpdateItems();
          } else {
            console.log('Failed to insert');
          }
        },
        error => {
          console.log('Error executing SQL:', error);
        },
      );
    });
  });
};

export const updateMasterSyncUpdateItem = async (
  apiname: string,
  status: boolean,
) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    tx.executeSql('UPDATE mastersync SET  status =?  WHERE apiname =?', [
      status,
      apiname,
    ]);
  });
};
export const clearMasterSyncUpdateTable = tableName => {
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
  setupMasterSyncUpdateDatabase,
  getAllMasterSyncUpdateItems,
  insertMasterSyncUpdateItems,
  clearMasterSyncUpdateTable,
  updateMasterSyncUpdateItem,
};
