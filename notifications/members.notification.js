const { MEMBERS } = require('../constants/entity-names');
const { UPDATE, NEW, INVITATION } = require('../constants/event-names');
const MemberRepository = require('../repositories/member.repository');
const CacheRepository = require('../repositories/cache.repository');
const cacheService = require('../services/cache.service');

const createMemberCache = (eventName, userId, data) => {
  return CacheRepository.createCache(MEMBERS, eventName, userId, data);
};

const notifyEachActiveMemberOn = async (generateCache, spaceId) => {
  const members = await MemberRepository.findBySpaceIdAndInvitationStatusAccepted(spaceId);

  members.forEach(async (member) => {
    await generateCache(member);

    cacheService.emitUpdateCache(member.userId);
  });
};

const memberUpdated = (spaceId, memberId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { memberId };
    await createMemberCache(UPDATE, member.userId, data);
  }, spaceId);
};

const newMember = (spaceId, memberId) => {
  notifyEachActiveMemberOn(async (member) => {
    const data = { memberId };
    await createMemberCache(NEW, member.userId, data);
  }, spaceId);
};

const newInvitation = async (spaceId, userId) => {
  const data = { spaceId };
  await createMemberCache(INVITATION, userId, data);
  cacheService.emitUpdateCache(userId);
};

module.exports = {
  notifyEachActiveMemberOn,
  memberUpdated,
  newMember,
  newInvitation,
};