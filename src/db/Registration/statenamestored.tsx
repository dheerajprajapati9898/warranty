import SQLite from 'react-native-sqlite-storage';

// const db = SQLite.openDatabase({ name: 'StateTable.db' });
SQLite.DEBUG(true);
SQLite.enablePromise(true);
let db;

const openDB = async () => {
    try {
        db = await SQLite.openDatabase({ name: 'statenamestored.db', location: 'default' });
        console.log('Database opened successfully');
    } catch (error) {
        console.error('Error opening database:', error);
    }
};

// openDB();

export const setupstatenamestoredDatabase = async () => {
    try {
        if (!db) {
            await openDB(); // Ensure the database is opened
        }
        db.transaction(txn => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='states'",
                [],
                (tx, res) => {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS states', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS statename (id INTEGER PRIMARY KEY AUTOINCREMENT, statename TEXT)',
                            [],
                        );
                    }
                },
                (error) => {
                    console.log('Error checking/creating table:', error);
                },
            );
        });
    } catch (error) {
        console.error('Transaction error:', error);
    }
};


// Function to fetch all items from the database
export const getAllstatenamestoredItems = async () => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM statename',
                [],
                (tx, results) => {
                    const statename = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        statename.push(results.rows.item(i));
                    }
                    resolve(statename);
                },
                (error) => {
                    console.error('Error fetching statename:', error);
                    reject(error);
                }
            );
        });
    });
};
export const insertstatenamestoredItems = async (items) => {
    if (!db) {
        await openDB(); // Ensure the database is opened
    }
    db.transaction(tx => {
        items.forEach(item => {
            tx.executeSql(
                'INSERT INTO statename ( statename) VALUES (?)',
                [item.stateid, item.statename],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        console.log('Inserted successfully');
                    } else {
                        console.log('Failed to insert');
                    }
                },
                (error) => {
                    console.log('Error executing SQL:', error);
                }
            );
        });
    }, (transactionError) => {
        console.error('SQLite transaction error:', transactionError.message);
    }, () => {
        console.log('Transaction complete');
    });
}
export const clearStateTable = tableName => {
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
export default { setupstatenamestoredDatabase, getAllstatenamestoredItems, insertstatenamestoredItems, clearStateTable };
