/*
 *  Purpose: Provide unified service for establishing Force.com connection using consistent connection details.
 *  Author: ashchandran@deloitte.com
 */

// Get JSForce library
const jsforce = require("jsforce");

// Get dynamic env vars for the connection
// Salesforce login url for prod/sandbox
const SF_LOGIN_URL = process.env.SF_LOGIN_URL;

// Integration user username
const SF_USERNAME = process.env.SF_USERNAME;

// Integration user password
const SF_PASSWORD = process.env.SF_PASSWORD;

// Public methods
module.exports = {
    Query: apiQuery,
    getConnection: authenticate,
    create: crudCreate,
    update: crudUpdate,
    delete: crudDelete,
    upsert: crudUpsert,
    retrieve: crudRetrieve,
    find: apiFind,
    Search: apiSearch,
    Describe: apiDescribe,
    Email: apiEmail
}

/**
 * Create a connection and return the client
 */
function authenticate(callback) {
    // Create the connection
    var connection = new jsforce.Connection({
        // set the login location
        loginUrl: SF_LOGIN_URL
    });

    // Do the login
    connection.login(SF_USERNAME, SF_PASSWORD, function(err, user) {
        if (err) {
            // Quit if login is incorrect. TODO: Make more elegant.
            console.log("Error: ", err);
            return callback(err, connection);
        }

        // Debug context info
        console.log("--- New Force.com Connection ---")
        console.log("Connection : " + connection.instanceUrl);
        console.log("Session    : " + connection.accessToken);
        console.log("Org        : " + user.organizationId);
        console.log("User       : " + user.id);

        // Store Connection information
        process.env.SF_INSTANCE = connection.instanceUrl;
        process.env.SF_SESSION = connection.accessToken;

        // Return the connection
        return callback(null, connection);
    });
}


/**
 *  This query will be used for SFDC SOQL queries.
 *
 *  @param {String} query: SOQL Query to execute
 *  @return {function} callback with query results
 */
function apiQuery(query, callback) {
    execute(
        function(conn, cb) {
            // Run native jsforce query
            conn.query(query, function(err, queryResult) {
                if (err) {
                    return cb(err, null)
                }
                return cb(null, queryResult);
            });
        },
        callback
    );
}

/**
 *  Check if session exists and return connection, else return empty connection
 */
function getSessionConnection(callback) {
    // Load Connection parameters
    var connObj = {
        instanceUrl: process.env.SF_INSTANCE,
        accessToken: process.env.SF_SESSION
    };

    if (connObj) {
        // Create connection client
        var conn = new jsforce.Connection({
            instanceUrl: connObj.instanceUrl,
            accessToken: connObj.accessToken
        });

        return callback(conn);
    }

    // Create connection client
    var conn = new jsforce.Connection({
        serverUrl: "",
        sessionId: ""
    });

    return callback(conn);
}

/**
 *  Salesforce CRUD Operations
 *  individual logic for each of the CRUD Operations using a common execution flow
 */

/**
 *  Create function
 *
 *  @param {String} ob: Object name in Salesforce
 *  @param {Object} values: Feilds to modify in Salesforce in a key value pair
 *  @return {function} callback
 */
function crudCreate(ob, values, callback) {
    execute(
        function(conn, cb) {
            conn.sobject(ob).create(values, function(err, rets) {
                if (err) {
                    return cb(err, null)
                }
                return cb(null, rets);
            });
        },
        callback
    );
}

/**
 *  Update function
 *
 *  @param {String} ob: Object name in Salesforce
 *  @param {Object} values: Feilds to modify in Salesforce in a key value pair
 *  @return {function} callback
 */
function crudUpdate(ob, values, callback) {
    execute(
        function(conn, cb) {
            conn.sobject(ob).update(values, function(err, rets) {
                if (err) {
                    console.info("Error in update:",err);
                    return cb(err, null)
                }
                return cb(null, rets);
            });
        },
        callback
    );
}

/**
 *  Delete function
 *
 *  @param {String} ob: Object name in Salesforce
 *  @param {Object} values: Feilds to modify in Salesforce in a key value pair
 *  @return {function} callback
 */
function crudDelete(ob, values, callback) {
    execute(
        function(conn, cb) {
            conn.sobject(ob).del(values, function(err, rets) {
                if (err) {
                    return cb(err, null)
                }
                return cb(null, rets);
            });
        },
        callback
    );
}

/**
 *  Upsert function
 *
 *  @param {String} ob: Object name in Salesforce
 *  @param {Object} values: Feilds to modify in Salesforce in a key value pair
 *  @param {String} extrnId: External Id used to modify fields
 *  @return {function} callback
 */
function crudUpsert(ob, values, extrnId, callback) {
    execute(
        function(conn, cb) {
            conn.sobject(ob).upsert(values, extrnId, function(err, rets) {
                if (err) {
                    return cb(err, null)
                }
                return cb(null, rets);
            });
        },
        callback
    );
}

/**
 *  Retrieve function
 *
 *  @param {String} ob: Object name in Salesforce
 *  @param {Object} values: Feilds to modify in Salesforce in a key value pair
 *  @return {function} callback
 */
function crudRetrieve(ob, values, callback) {
    execute(
        function(conn, cb) {
            conn.sobject(ob).retrieve(values, function(err, rets) {
                if (err) {
                    return cb(err, null)
                }
                return cb(null, rets);
            });
        },
        callback
    );
}

/**
 *  Find records based on filter
 *
 *  @param {String} ob: Object name in Salesforce
 *  @param {Object} filters: filter parameters for the find in json format
 *  @param {Object} or {String} feilds: feilds to retrive in the find
 *  @param {Object} options: the following options are valid
 *                      sort : {Number}
 *                      limit: {Number}
 *                      skip : {Number}
 *  @return {function} callback
 */
function apiFind(ob, filters, feilds, options, callback) {
    execute(
        function(conn, cb) {
            conn.sobject(ob).find(filters, feilds)

                // Check if sort option set
                .sort(options.sort)

                // Check if limit option set
                .limit(options.limit)

                // Check if skip option set
                .skip(options.skip)

                // Execute query
                .execute(function(err, rets) {
                    if (err) {
                        return cb(err, null);
                    }
                    return cb(null, rets);
                });
        },
        callback
    );
}

/**
 *  Search records
 *
 *  @param {String} query: Search query in Salesforce
 *  @return {function} callback
 */
function apiSearch(query, callback) {
    execute(
        function(conn, cb) {
            // Run native jsforce query
            conn.search(query, function(err, queryResult) {
                if (err) {
                    return cb(err, null)
                }
                return cb(null, queryResult);
            });
        },
        callback
    );
}

/**
 *  Describe object
 *
 *  @param {String} ob: Object name in Salesforce
 *  @return {function} callback
 */
function apiDescribe(ob, callback) {
    execute(
        function(conn, cb) {
            // Run native jsforce query
            conn.sobject(ob).describe$(function(err, meta) {
                if (err) {
                    return cb(err, null)
                }
                return cb(null, meta);
            });
        },
        callback
    );
}

/**
 *  Send Email
 *
 *  @param {String} url: Object name in Salesforce
 *  @param {String} ob: mail information Object
 *  @return {function} callback
 */
function apiEmail(url, ob, callback) {
    execute(
        function(conn, cb) {
            // Run native jsforce query
            conn.apex.post(url, ob, function(err, res) {
                if (err) {
                    return cb(err, null);
                }
                return cb(null, res);
            });
        },
        callback
    );
}


/**
 *  CRUD and Query execution flow
 *  All CRUD Operations and SOQL queries are executed with an existing or null session.
 *  if this fails, a new session is authenticated and the call is reexecuted.
 *  This flow is common across all the operations.
 *
 *  @param {function} call: CRUD function that muct be called
 *  @return {function} callback.
 */
function execute(call, callback) {
    // Check for stored sessionid
    getSessionConnection(function(conn) {
        // Run native jsforce query
        console.log("Execute with Access Token --");
        call(conn, function(err, result) {
            if (err) {
                console.log("Error with Access Token, Reauthenticating -- ");
                // Authenticate with new session
                authenticate(function(err, result) {
                    if (err) {
                        console.log("Auth Error: " + err);
                        return callback(err, null);
                    }

                    // Retry
                    console.log("Retry with new Access Token --");
                    getSessionConnection(function(conn) {
                        call(conn, function(err, res) {
                            if (err) {
                                console.log("Retry Error: ", err);
                                return callback(err, null);
                            }
                            return callback(null, res);
                        })
                    });
                });
            } else {
                return callback(err, result);
            }
        });
    });
}
