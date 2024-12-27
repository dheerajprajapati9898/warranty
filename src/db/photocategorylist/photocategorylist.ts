import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({
      name: 'SettingsTable.db',
      location: 'default',
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();ˀ

export const setupPhotoCategorylistDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='photocategorylist'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS photocategorylist', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS photocategorylist (id INTEGER PRIMARY KEY AUTOINCREMENT ,Photo_Category_ARC TEXT,Photo_Category_ID INTEGER,Photo_Category_Name TEXT)',
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
export const getPhotoCategorylistItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM photocategorylist',
        [],
        (tx, results) => {
          const photocategorylist = [];
          for (let i = 0; i < results.rows.length; ++i) {
            photocategorylist.push(results.rows.item(i));
          }

          resolve(photocategorylist);
        },
        error => {
          console.error('Error fetching photocategorylist:', error);
          reject(error);
        },
      );
    });
  });
};
export const getPhotoCategorylistbyuseridItems = async () => {
  const savedUserId = await AsyncStorage.getItem('userid');
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM photocategorylist WHERE created_by=?',
        [savedUserId],
        (tx, results) => {
          const photocategorylist = [];
          for (let i = 0; i < results.rows.length; ++i) {
            photocategorylist.push(results.rows.item(i));
          }
          resolve(photocategorylist);
        },
        error => {
          console.error('Error fetching photocategorylist:', error);
          reject(error);
        },
      );
    });
  });
};

export const insertPhotoCategorylistItems = async items => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(
    tx => {
      items.forEach(item => {
        tx.executeSql(
          'INSERT INTO photocategorylist (Photo_Category_ARC, Photo_Category_ID,Photo_Category_Name) VALUES (?,?,?)',
          [
            item.Photo_Category_ARC,
            item.Photo_Category_ID,
            item.Photo_Category_Name,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Inserted successfully category id');
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
export const clearPhotoCategorylistTable = tableName => {
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
  setupPhotoCategorylistDatabase,
  getPhotoCategorylistItems,
  insertPhotoCategorylistItems,
  clearPhotoCategorylistTable,
  getPhotoCategorylistbyuseridItems,
};
