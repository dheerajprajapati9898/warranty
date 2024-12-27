import SQLite from 'react-native-sqlite-storage';
import {getAllLoginItems} from './../Login/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({
      name: 'LeadShowTable.db',
      location: 'default',
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupLeadShowDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='lead'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS lead', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS lead (id INTEGER PRIMARY KEY AUTOINCREMENT, warrantyid INTEGER,mmobilenumber TEXT,createdby INTEGER)',
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
export const getAllLeadShowItems = async (userid: number) => {
  const savedUserId = await AsyncStorage.getItem('userid');
  const userData = await getAllLoginItems();

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM lead WHERE createdby=?',
        [userid],
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
  // return new Promise((resolve, reject) => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT * FROM Pins',
  //       [],
  //       (_, { rows }) => {
  //         const items = [];
  //         for (let i = 0; i < rows.length; i++) {
  //           items.push(rows.item(i));
  //         }
  //         resolve(items);
  //       },
  //       (_, error) => reject(error),
  //     );
  //   });
  // });
};

// Function to insert multiple items into the database
// Function to insert multiple items into the database
export const insertLeadShowItems = async (
  warrantyid: number,
  mmobilenumber: string,
) => {
  // const userData = await getAllLoginItems()
  const savedUserId = await AsyncStorage.getItem('userid');
  // return
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO lead (warrantyid,mmobilenumber,createdby) VALUES (?,?,?)',
      [warrantyid, mmobilenumber, savedUserId],
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
export const clearLeadShowTable = tableName => {
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
  setupLeadShowDatabase,
  getAllLeadShowItems,
  insertLeadShowItems,
  clearLeadShowTable,
};
