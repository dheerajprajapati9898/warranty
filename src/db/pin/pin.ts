import SQLite from 'react-native-sqlite-storage';
import {getAllLoginItems} from './../Login/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({name: 'PinTable.db', location: 'default'});
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupPinDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='pintable'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS pintable', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS pintable (id INTEGER PRIMARY KEY AUTOINCREMENT, pin TEXT,created_by INTEGER)',
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
export const getAllPinItems = async () => {
  const savedUserId = await AsyncStorage.getItem('userid');
  const userData = await getAllLoginItems();

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pintable ',
        [],
        (tx, results) => {
          const Pins = [];
          for (let i = 0; i < results.rows.length; ++i) {
            Pins.push(results.rows.item(i));
          }
          resolve(Pins);
        },
        error => {
          console.error('Error fetching Pins:', error);
          reject(error);
        },
      );
    });
  });
};

export const insertPinItems = async (pin: string) => {
  const savedUserId = await AsyncStorage.getItem('userid');
  // return
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO pintable (pin,created_by) VALUES (?,?)',
      [pin, savedUserId],
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
};
export const updatePinItems = async pin => {
  try {
    const savedUserId = await AsyncStorage.getItem('userid');

    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    await db.transaction(async tx => {
      await tx.executeSql(
        'UPDATE  pintable SET pin=?  WHERE created_by=?  ',
        [pin, savedUserId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('updated successfully');
          } else {
            console.log('Failed to update');
          }
        },
        error => {
          console.error('Error executing SQL:', error);
        },
      );
    });
  } catch (error) {
    console.error('SQLite transaction error:', error);
  }
};

export const clearPinTable = async () => {
  const savedUserId = await AsyncStorage.getItem('userid');
  const itemsFromDb = await getAllLoginItems();

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM pintable WHERE created_by=?;',
        [savedUserId],
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
  setupPinDatabase,
  getAllPinItems,
  insertPinItems,
  clearPinTable,
  updatePinItems,
};
