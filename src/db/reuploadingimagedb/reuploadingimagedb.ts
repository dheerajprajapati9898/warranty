import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {log} from '@react-native-firebase/crashlytics';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({
      name: 'reuploadingimagedbTable.db',
      location: 'default',
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();

export const setupreuploadingimagedbDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='reuploadingimagetable'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS reuploadingimagetable', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS reuploadingimagetable (id INTEGER PRIMARY KEY AUTOINCREMENT, warranty_id INTEGER, file TEXT,mobilenumber INTEGER,image_category_id INTEGER,image_name TEXT,agency_id INTEGER,Latitude TEXT,Longitude TEXT,InspectionDateTime TEXT,PhotoName, TEXT,errcode TEXT,payload TEXT,formdata TEXT,herder TEXT,status_code INTEGER,created_by INTEGER)',
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

export const getreuploadingimagedbid = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  const userid = await AsyncStorage.getItem('userid');

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reuploadingimagetable WHERE created_by=?',
        [userid],
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
export const getdatabyerrorcode = async (
  errorcode: string,
  warranty_id: number,
) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  const userid = await AsyncStorage.getItem('userid');
  console.log('userid by login 0', userid);

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reuploadingimagetable WHERE created_by=? AND errcode=? AND warranty_id=?',
        [userid, errorcode, warranty_id],
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
// Function to fetch all items from the database
export const getAllreuploadingimagedbItems = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM reuploadingimagetable',
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
export const insertreuploadingimagedbItems = async (
  warranty_id: number,
  file: string,
  mobilenumber: number,
  image_category_id: number,
  image_name: string,
  agency_id: number,
  Latitude: number,
  Longitude: number,
  InspectionDateTime: string,
  PhotoName: string,
  errcode: string,
  payload: string,
  formdata: string,
  herder: string,
  status_code: number,
) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  const userid = await AsyncStorage.getItem('userid');

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO reuploadingimagetable (warranty_id , file, mobilenumber ,image_category_id ,image_name ,agency_id,Latitude ,Longitude ,InspectionDateTime ,PhotoName ,errcode,payload,formdata,herder,status_code,created_by ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        warranty_id,
        file,
        mobilenumber,
        image_category_id,
        image_name,
        agency_id,
        Latitude,
        Longitude,
        InspectionDateTime,
        PhotoName,
        errcode,
        payload,
        formdata,
        herder,
        status_code,
        userid,
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('Inserted successfully faildimage');
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
export const updatereuploadingimage = async (
  warranty_id: number,
  status_code: number,
) => {
  try {
    const savedUserId = await AsyncStorage.getItem('userid');

    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    await db.transaction(async tx => {
      await tx.executeSql(
        'UPDATE  reuploadingimagetable SET status_code=?  WHERE created_by=?  AND warranty_id =?',
        [status_code, savedUserId, warranty_id],
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
export const clearreuploadingimagedbTable = async () => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM reuploadingimagetable',
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
export const deleteItemById = (id: number) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM reuploadingimagetable WHERE id = ?',
      [id],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('Item deleted successfully');
        } else {
          console.log('Item not found');
        }
      },
      error => {
        console.error('Error deleting item:', error);
      },
    );
  });
};

export default {
  setupreuploadingimagedbDatabase,
  getAllreuploadingimagedbItems,
  insertreuploadingimagedbItems,
  clearreuploadingimagedbTable,
  getreuploadingimagedbid,
  deleteItemById,
  getdatabyerrorcode,
  updatereuploadingimage,
};
