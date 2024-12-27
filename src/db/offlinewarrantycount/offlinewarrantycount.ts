import SQLite from 'react-native-sqlite-storage';
import {
  getAllStateItems,
  getStateid,
  insertStateItems,
  setupStateDatabase,
} from '../Registration/StateDb';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {log} from '@react-native-firebase/crashlytics';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({
      name: 'offlinewarrantycountTable.db',
      location: 'default',
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupofflinewarrantycountDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='offlinewarrantycount'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS offlinewarrantycount', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS offlinewarrantycount (id INTEGER PRIMARY KEY AUTOINCREMENT, today_wr_count TEXT, month_wr_count TEXT,total_wr_count TEXT,created_by INTEGER )',
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

export const getAllofflinewarrantycountItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM offlinewarrantycount',
        [],
        (tx, results) => {
          const offlinewarrantycount = [];
          for (let i = 0; i < results.rows.length; ++i) {
            offlinewarrantycount.push(results.rows.item(i));
          }

          resolve(offlinewarrantycount);
        },
        error => {
          console.error('Error fetching offlinewarrantycount:', error);
          reject(error);
        },
      );
    });
  });
};
export const insertofflinewarrantycountItems = async (
  today_wr_count,
  month_wr_count,
  total_wr_count,
) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }

  const savedUserId = await AsyncStorage.getItem('userid');

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO offlinewarrantycount (today_wr_count, month_wr_count,total_wr_count,created_by) VALUES (?,?,?,?)',
      [today_wr_count, month_wr_count, total_wr_count, savedUserId],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('Inserted successfully offlinewarrantycount');
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
export const updateofflinewarrantycountItems = async (
  today_wr_count,
  month_wr_count,
  total_wr_count,
) => {
  try {
    const savedUserId = await AsyncStorage.getItem('userid');

    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    await db.transaction(async tx => {
      await tx.executeSql(
        'UPDATE  offlinewarrantycount SET today_wr_count=?, month_wr_count=?, total_wr_count=?  WHERE created_by=?  ',
        [today_wr_count, month_wr_count, total_wr_count, savedUserId],
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
export const clearofflinewarrantycountTable = tableName => {
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
  setupofflinewarrantycountDatabase,
  getAllofflinewarrantycountItems,
  insertofflinewarrantycountItems,
  clearofflinewarrantycountTable,
  updateofflinewarrantycountItems,
};
