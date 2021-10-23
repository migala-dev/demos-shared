const DbHelper = require('./db.helper');
const User = require('../models/user.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class UserRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = User.name;
    this.tableName = 'users';
    this.colId = 'user_id';
  }

  async findOneByPhoneNumber(phoneNumber) {
    const query = SqlQuery.select.from(this.tableName)
    .where({ phone_number: SqlQuery.sql.like(`%${phoneNumber}`) })
    .limit(1)
    .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  async findOneByCognitoId(cognitoId) {
    const query = SqlQuery.select.from(this.tableName)
    .where({ cognito_id: cognitoId })
    .limit(1)
    .build();
    const result = await excuteQuery(query);
    return result[0];
  }

  async findAllByIds(userIds) {
    const query = SqlQuery.select.from(this.tableName)
    .where({ user_id: userIds })
    .build();
    return await excuteQuery(query);
  }
}

module.exports = new UserRepository();
