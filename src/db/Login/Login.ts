import {
  setUserName,
  getUserName,
  setUserId,
  getUserId,
} from './../../components/SharedPreference';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({
      name: 'LoginTable.db',
      location: 'default',
    });
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

// openDB();
export const setupLoginDatabase = async () => {
  try {
    if (!db) {
      await openDB(); // Ensure the database is opened
    }
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='login'",
        [],
        (tx, res) => {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS login', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS login (id INTEGER PRIMARY KEY AUTOINCREMENT, Address TEXT, AgencyId INTEGER, AgencyName TEXT, AgencyUrl TEXT, Captcha TEXT, CurrentDate TEXT, EmailId TEXT, IsLockedOut INTEGER, IsSessionTimeout INTEGER, IsValidCaptcha INTEGER, Msg TEXT, Name TEXT, Pin_Code TEXT, PrimaryMobileNo TEXT, ProfileURL TEXT, Role_Name TEXT, SessionID TEXT, StateName TEXT, UserID INTEGER, Username TEXT,mpin TEXT)',

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
export const getAllLoginItems = async () => {
  const savedUserId = await AsyncStorage.getItem('userid');

  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM login WHERE UserId=?',
        [savedUserId],
        (tx, results) => {
          const login = [];
          for (let i = 0; i < results.rows.length; ++i) {
            login.push(results.rows.item(i));
          }

          resolve(login[0]);
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
export const insertLoginItems = async (item, userid: number) => {
  // const savedUserId = await AsyncStorage.getItem('userid');
  // return
  try {
    const result = await db.executeSql(
      'INSERT INTO login (Address, AgencyId, AgencyName, AgencyUrl, Captcha, CurrentDate, EmailId, IsLockedOut, IsSessionTimeout, IsValidCaptcha, Msg, Name, Pin_Code, PrimaryMobileNo, ProfileURL, Role_Name, SessionID, StateName, UserID, Username) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [
        item.Address,
        item.AgencyId,
        item.AgencyName,
        item.AgencyUrl,
        item.Captcha,
        item.CurrentDate,
        item.EmailId,
        item.IsLockedOut,
        item.IsSessionTimeout,
        item.IsValidCaptcha,
        item.Msg,
        item.Name,
        item.Pin_Code,
        item.PrimaryMobileNo,
        item.ProfileURL,
        item.Role_Name,
        item.SessionID,
        item.StateName,
        item.UserID,
        item.Username,
      ],
    );

    if (result && result.length > 0) {
      return result[0].insertId;
    } else {
      throw new Error('Failed to insert item');
    }
  } catch (error) {
    console.error('Error inserting item:', error);
    throw error;
  }
};
export const updatelogintable = async (item, UserId) => {
  try {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO login (Address, AgencyId, AgencyName, AgencyUrl, Captcha, CurrentDate, EmailId, IsLockedOut, IsSessionTimeout, IsValidCaptcha, Msg, Name, Pin_Code, PrimaryMobileNo, ProfileURL, Role_Name, SessionID, StateName, UserID, Username  ) VALUES ((?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          item.Username,
          item.ProfileURL,
          item.AgencyUrl,
          item.Password,
          item.StateName,
          item.Pin_Code,
          item.CurrentDate,
          item.Name,
          item.MobileNo,
          UserId,
          item.RoleName,
          item.AgencyId,
          item.AgencyName,
          item.IsLockedOut,
          item.SessionID,
          item.Address,
          item.EmailId,
        ],
      );
    });
  } catch (error) {
    console.error('updatelogintable', error);
  }
};
export const loginInsertChecked = async (item, UserId) => {
  try {
    const tx = await db.transaction(async tx => {
      // Check if record with UserId exists
      new Promise(async (resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM login WHERE UserId=?',
            [UserId],
            async (tx, results) => {
              const len = results.rows.length;
              if (len === 0) {
                // Insert record if UserId doesn't exist
                const insertResult = await new Promise((resolve, reject) => {
                  tx.executeSql(
                    'INSERT INTO login (Username, ProfileURL, AgencyUrl, Password, StateName, Pin_Code, CurrentDate, Name, MobileNo, UserId, RoleName, AgencyId, AgencyName, IsLockedOut, SessionID, Address, EmailId  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                      item.Username,
                      item.ProfileURL,
                      item.AgencyUrl,
                      item.Password,
                      item.StateName,
                      item.Pin_Code,
                      item.CurrentDate,
                      item.Name,
                      item.MobileNo,
                      UserId,
                      item.RoleName,
                      item.AgencyId,
                      item.AgencyName,
                      item.IsLockedOut,
                      item.SessionID,
                      item.Address,
                      item.EmailId,
                    ],
                    (_, results) => resolve(results.insertId),
                    error => reject(error),
                  );
                });

                if (insertResult) {
                  return insertResult;
                } else {
                  throw new Error('Failed to insert item');
                }
              } else {
                return null; // Return existing record ID or relevant identifier
              }
            },
            error => {
              console.error('Error fetching states:', error);
              reject(error);
            },
          );
        });
      });
    });
  } catch (error) {
    console.error('Error executing transaction:', error);
  }
};
export const updateLoginItem = async (UserId: number, mpin: number) => {
  if (!db) {
    await openDB(); // Ensure the database is opened
  }
  db.transaction(tx => {
    tx.executeSql('UPDATE login SET  mpin =?  WHERE  UserId=?', [mpin, UserId]);
  });
};
export const clearLoginTable = tableName => {
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
export const clearLoginTables = async () => {
  const savedUserId = await AsyncStorage.getItem('userid');

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM login WHERE UserID=?',
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
  setupLoginDatabase,
  getAllLoginItems,
  insertLoginItems,
  loginInsertChecked,
  clearLoginTable,
  updateLoginItem,
  updatelogintable,
  clearLoginTables,
};
