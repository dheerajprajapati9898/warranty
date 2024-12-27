import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
  try {
    db = await SQLite.openDatabase({ name: 'PinCodeTable.db', location: 'default' });
    console.log('Database opened successfully');
  } catch (error) {
    console.error('Error opening database:', error);
  }
};

export const setupPinCodeDatabase = async () => {
  try {
    await openDB(); // Ensure the database is opened
    // Create tables if they do not exist
    db.transaction(txn => {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='pincodetable'",
        [],
        (tx, res) => {
          if (res.rows.length === 0) {
            txn.executeSql('DROP TABLE IF EXISTS pincodetable', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS pincodetable (id INTEGER PRIMARY KEY AUTOINCREMENT, districtid INTEGER, districtname TEXT, isActive TEXT, cityvillageid INTEGER, cityvillagename TEXT, pincodeid INTEGER, areapincode INTEGER,stateid TEXT)',
              [],
              () => console.log('Table pincodetable created successfully'),
              error => console.error('Error creating pincodetable:', error)
            );
          }
        }
      );
    });
  } catch (error) {
    console.error('Transaction error:', error);
  }
};

// export const insertPinCodeItems = async (districtid, districtname, isActive, cityvillageid, cityvillagename, pincodeid, areapincode, stateid) => {
//   // console.log("stateidadakopadaopsd", stateid);
//   // return
//   try {
//     if (!db) {
//       await openDB(); // Ensure the database is opened
//       await setupPinCodeDatabase(); // Ensure the table is created
//     }


//     db.transaction(tx => {
//       tx.executeSql(
//         'INSERT INTO pincodetable (districtid, districtname, isActive, cityvillageid, cityvillagename, pincodeid, areapincode,stateid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//         [districtid, districtname, isActive, cityvillageid, cityvillagename, pincodeid, areapincode, stateid],
//         (tx, results) => {
//           console.log('Results', results.rowsAffected);
//           if (results.rowsAffected > 0) {
//             console.log('Inserted successfully');
//           } else {
//             console.log('Failed to insert');
//           }
//         },
//         (tx, error) => {
//           console.log('Error executing SQL:', error);
//         }
//       );
//     }, (transactionError) => {
//       console.error('SQLite transaction error:', transactionError.message);
//     }, () => {
//       console.log('Transaction complete');
//     });
//   } catch (error) {
//     console.error('Error in insertPinCodeItems:', error);
//   }
// };
// export const insertPinCodeItems = async (
//   districtid, districtname, isActive, cityvillageid, cityvillagename, pincodeid, areapincode, stateid
// ) => {

//   return new Promise(async (resolve, reject) => {
//     if (!db) {
//       await openDB(); // Ensure the database is opened
//       await setupPinCodeDatabase()
//     }
//     db.transaction(tx => {
//       tx.executeSql(
//         'INSERT INTO pincodetable (districtid, districtname, isActive, cityvillageid, cityvillagename, pincodeid, areapincode, stateid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//         [districtid, districtname, isActive, cityvillageid, cityvillagename, pincodeid, areapincode, stateid],
//         (tx, results) => {
//           console.log('Results', results.rowsAffected);
//           if (results.rowsAffected > 0) {
//             console.log('Inserted successfully');
//             resolve(); // Resolve the promise when insertion is successful
//           } else {
//             console.log('Failed to insert');
//             reject(new Error('Failed to insert')); // Reject the promise if insertion fails
//           }
//         },
//         (tx, error) => {
//           console.log('Error executing SQL:', error);
//           reject(error); // Reject the promise if there's a SQL execution error
//         }
//       );
//     }, (transactionError) => {
//       console.error('SQLite transaction error:', transactionError.message);
//       reject(transactionError); // Reject the promise if there's a transaction error
//     });

//   });
// };
export const insertPinCodeItems = async (
  items, stateid
) => {

  return new Promise(async (resolve, reject) => {
    if (!db) {
      await openDB(); // Ensure the database is opened
      await setupPinCodeDatabase()
    }
    db.transaction(tx => {
      items.forEach(item => {
        tx.executeSql(
          'INSERT INTO pincodetable (districtid, districtname, isActive, cityvillageid, cityvillagename, pincodeid, areapincode, stateid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [item.districtid, item.districtname, item.isActive, item.cityvillageid, item.cityvillagename, item.pincodeid, item.areapincode, stateid],
          (tx, results) => {
            if (results.rowsAffected) {
              resolve(); // Resolve the promise when insertion is successful
            } else {
              console.log('Failed to insert');
              reject(new Error('Failed to insert')); // Reject the promise if insertion fails
            }
          },
          (tx, error) => {
            console.log('Error executing SQL:', error);
            reject(error); // Reject the promise if there's a SQL execution error
          }
        );
      }, (transactionError) => {
        console.error('SQLite transaction error:', transactionError.message);
        reject(transactionError); // Reject the promise if there's a transaction error
      });
    })
  });
};

export const getAllPinCodeItems = async (id) => {
  try {
    await openDB(); // Ensure the database is opened

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT    areapincode,    districtid,    districtname,    cityvillageid,    cityvillagename,    pincodeid,  isActive FROM    pincodetable WHERE    stateid = ? GROUP BY    areapincode',
          // 'SELECT * FROM  pin codetable WHERE stateid=?;',
          [id],
          (tx, results) => {
            const pincodes = [];
            for (let i = 0; i < results.rows.length; ++i) {
              pincodes.push(results.rows.item(i));
            }
            resolve(pincodes);
          },
          error => {
            console.error('Error fetching pincodes:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in getAllPinCodeItems:', error);
  }
};
export const getAllPinCodedataItems = async (areapincode: number) => {
  try {
    await openDB(); // Ensure the database is opened

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM pincodetable WHERE  areapincode=? GROUP BY areapincode;',
          [areapincode],
          (tx, results) => {
            const pincodes = [];
            for (let i = 0; i < results.rows.length; ++i) {
              pincodes.push(results.rows.item(i));
            }
            resolve(pincodes);
          },
          error => {
            console.error('Error fetching pincodes:', error);
            reject(error);
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in getAllPinCodeItems:', error);
  }
};
export const clearPinCodeTable = tableName => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(`DELETE FROM ${tableName}`, [], (_, result) => {
        resolve(result);
      }, (_, error) => {
        reject(error);
      });
    });
  });
};

export default { setupPinCodeDatabase, getAllPinCodeItems, insertPinCodeItems, clearPinCodeTable, getAllPinCodedataItems };
