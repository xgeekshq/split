const { SessionUserFactory } = require('../src/utils/factories/user.ts');

module.exports = {
  sadmin: {
    title: 'Super Admin',
    session: {
      data: {
        user: SessionUserFactory.create({ isSAdmin: true }),
      },
      status: 'authenticated',
    },
  },
  regularuser: {
    title: 'Regular User',
    session: {
      data: {
        user: SessionUserFactory.create({ isSAdmin: false }),
      },
      status: 'authenticated',
    },
  },
  member: {
    title: 'Member',
    session: {
      data: {
        user: SessionUserFactory.create({ isSAdmin: false, isMember: true }),
      },
      status: 'authenticated',
    },
  },
};
