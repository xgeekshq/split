module.exports = {
  sadmin: {
    title: 'Super Admin',
    session: {
      data: {
        user: {
          isSAdmin: true,
        },
      },
      status: 'authenticated',
    },
  },
  notsadmin: {
    title: 'Not Super Admin',
    session: {
      data: {
        user: {
          isSAdmin: false,
        },
      },
      status: 'authenticated',
    },
  },
};
