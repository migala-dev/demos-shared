const DbHelper = require('./db.helper');
const Space = require('../models/space.model');
const MemberRepository = require('./member.repository');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery, convertPropNameToColumnNotation } = require('./db.utils');

class SpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Space.name;
    this.tableName = 'spaces';
    this.colId = 'space_id';
  }

  async findAllByUserId(userId) {
    const spaceColumnNames = Object.keys(new Space()).map((key) => convertPropNameToColumnNotation(key));

    const query = SqlQuery.select
      .from(this.tableName)
      .select(spaceColumnNames)
      .from(MemberRepository.tableName, this.colId, this.tableName, this.colId)
      .where({ user_id: userId })
      .order('t1.created_at', 'A')
      .build();
    return excuteQuery(query);
  }

  async updateNameAndDescriptionAndPercentages(spaceId, name, description, approvalPercentage, participationPercentage) {
    const updateInfo = this._getUpdateInfoObject(name, description, approvalPercentage, participationPercentage);

    const query = SqlQuery.update
      .into(this.tableName)
      .set(updateInfo)
      .where({ space_id: spaceId })
      .build();
    return excuteQuery(query);
  }

  _getUpdateInfoObject(name, description, approvalPercentage, participationPercentage) {
    const updateInfo = {};

    if (!!name) {
      updateInfo.name = name;
    }
    if (description != null) {
      updateInfo.description = description;
    }

    if(!!approvalPercentage) {
      updateInfo['approval_percentage'] = approvalPercentage;
    }

    if(!!participationPercentage) {
      updateInfo['participation_percentage'] = participationPercentage;
    }
    return updateInfo;
  }

  async updatePictureKey(spaceId, pictureKey) {
    const query = SqlQuery.update.into(this.tableName).set({ picture_key: pictureKey }).where({ space_id: spaceId }).build();
    return excuteQuery(query);
  }

  createSpace(newSpace, currentUser) {
    const space = new Space();
    space.name = newSpace.name;
    space.description = newSpace.description;
    space.approvalPercentage = newSpace.approvalPercentage;
    space.participationPercentage = newSpace.participationPercentage;
    space.ownerId = currentUser.userId;
    return this.create(space);
  }
}

module.exports = new SpaceRepository();
