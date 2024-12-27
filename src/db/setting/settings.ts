import AsyncStorage from '@react-native-async-storage/async-storage';
import {log} from '@react-native-firebase/crashlytics';
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
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupSettingDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='setting'",
        [],
        (tx, res) => {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS setting', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS setting (id INTEGER PRIMARY KEY AUTOINCREMENT ,state_id TEXT, statename TEXT,areapincode INTEGER,cityvillageid INTEGER,cityvillagename TEXT,districtid INTEGER,districtname TEXT,pincodeid INTEGER,created_by INTEGER)',
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
export const getSettingItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM setting',
        [],
        (tx, results) => {
          const setting = [];
          for (let i = 0; i < results.rows.length; ++i) {
            setting.push(results.rows.item(i));
          }
          console.log('setting', setting);

          resolve(setting);
        },
        error => {
          console.error('Error fetching setting:', error);
          reject(error);
        },
      );
    });
  });
};
export const getSettingbyuseridItems = async () => {
  const savedUserId = await AsyncStorage.getItem('userid');
  console.log('defailt setting userid', savedUserId);

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM setting WHERE created_by=?',
        [savedUserId],
        (tx, results) => {
          console.log('setting results', results);

          const setting = [];
          for (let i = 0; i < results.rows.length; ++i) {
            setting.push(results.rows.item(i));
          }
          console.log('setting', setting);

          resolve(setting);
        },
        error => {
          console.error('Error fetching setting:', error);
          reject(error);
        },
      );
    });
  });
};

export const insertSettingItems = async (
  statename: string,
  stateid: string,
  areapincode: string,
  cityvillageid: number,
  cityvillagename: string,
  districtid: number,
  districtname: string,
  pincodeid: number,
  userid: number,
) => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    await db.transaction(async tx => {
      await tx.executeSql(
        'INSERT INTO setting (state_id, statename, areapincode ,cityvillageid ,cityvillagename ,districtid ,districtname ,pincodeid ,created_by) VALUES (?, ?, ?,?, ?, ?,?, ?, ?)',
        [
          stateid,
          statename,
          areapincode,
          cityvillageid,
          cityvillagename,
          districtid,
          districtname,
          pincodeid,
          userid,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Inserted successfully setting');
          } else {
            console.log('Failed to insert');
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
export const updateSettingItems = async (
  statename: string,
  stateid: string,
  areapincode: string,
  cityvillageid: number,
  cityvillagename: string,
  districtid: number,
  districtname: string,
  pincodeid: number,
  userid: number,
) => {
  try {
    console.log('starting the local database');

    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    await db.transaction(async tx => {
      await tx.executeSql(
        'UPDATE  setting SET state_id=?, statename=?, areapincode=? ,cityvillageid=? ,cityvillagename =?,districtid=? ,districtname =?,pincodeid =? WHERE created_by=?',
        [
          stateid,
          statename,
          areapincode,
          cityvillageid,
          cityvillagename,
          districtid,
          districtname,
          pincodeid,
          userid,
        ],
        (tx, results) => {
          console.log('starting the local database executing');

          console.log('update result:', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('updated successfully setting');
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
export const clearSettingTable = tableName => {
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
  setupSettingDatabase,
  getSettingItems,
  insertSettingItems,
  clearSettingTable,
  updateSettingItems,
  getSettingbyuseridItems,
};
