import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({
      name: 'OldTyreBrandNameTable.db',
      location: 'default',
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

export const setupOldTyreBrandNameDatabase = async () => {
  try {
    await openDB(); // Ensure the database is opened
    // Create tables if they do not exist
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='oldtyrebrandname'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS oldtyrebrandname', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS oldtyrebrandname (id INTEGER PRIMARY KEY AUTOINCREMENT, brandpatternId INTEGER, competitortyrecompanyid INTEGER,brandpattern TEXT)',
              [],
              () => console.log('Table oldtyrebrandname created successfully'),
              error => console.error('Error creating oldtyrebrandname:', error),
            );
          }
        },
      );
    });
  } catch (error) {
    console.error('Transaction error:', error);
  }
};
export const insertOldTyreBrandNameItems = async items => {
  try {
    await openDB(); // Ensure the database is opened
    await setupOldTyreBrandNameDatabase(); // Ensure the table is created

    db.transaction(
      tx => {
        items.forEach(item => {
          tx.executeSql(
            'INSERT INTO oldtyrebrandname (brandpatternId,competitortyrecompanyid ,brandpattern) VALUES (?, ?,?)',
            [
              item.brandpatternId,
              item.competitortyrecompanyid,
              item.brandpattern,
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log('Inserted successfully');
              } else {
                console.log('Failed to insert');
              }
            },
            error => console.log('Error executing SQL:', error),
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
  } catch (error) {
    console.error('Error in insertPinCodeItems:', error);
  }
};

export const getAllOldTyreBrandNameItems = async competitortyrecompanyid => {
  console.log('competitortyrecompanyid', competitortyrecompanyid);

  try {
    await openDB(); // Ensure the database is opened

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM oldtyrebrandname WHERE competitortyrecompanyid=?',
          [competitortyrecompanyid],
          (tx, results) => {
            const oldtyrebrandname = [];
            for (let i = 0; i < results.rows.length; ++i) {
              oldtyrebrandname.push(results.rows.item(i));
            }
            console.log('oldtyrebrandnameadghfrgh', oldtyrebrandname);

            resolve(oldtyrebrandname);
          },
          error => {
            console.error('Error fetching pincodes:', error);
            reject(error);
          },
        );
      });
    });
  } catch (error) {
    console.error('Error in getAllPinCodeItems:', error);
  }
};
export const clearOldTyreBrandNameTable = tableName => {
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
  setupOldTyreBrandNameDatabase,
  getAllOldTyreBrandNameItems,
  insertOldTyreBrandNameItems,
  clearOldTyreBrandNameTable,
};
