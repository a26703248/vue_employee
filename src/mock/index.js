let RESULT = {
  code: 200,
  msg: "error",
  data: {},
};
export default [
  {
    url: "/test_mock",
    method: "get",
    response: () => {
      return "Hello mockjs";
    },
  },
  {
    url: "/user/info",
    method: "post",
    response: () => {
      RESULT.data = {
        employeeId: -1,
        department: "資訊部門",
        jobName: "工程師",
        gender: "male",
        seatTel: "04",
        mobile: "0912345678",
        jobStartDate: "2022-02-01",
        email: "XXX@gmail.com",
      };
      return RESULT;
    },
  },
  {
    url: "/user/login",
    method: "post",
    response: () => {
      RESULT.data = {
        avatar: "#",
        username: "test",
        role: ["admin"],
        token: "aaa",
        isAdmin: true,
      };
      return RESULT;
    },
  },
  {
    url: "/user/logout",
    method: "post",
    response: () => {
      return RESULT;
    },
  },
  {
    url: "/user/update/profile",
    method: "post",
    response: () => {
      RESULT.data = {
        page:'profile'
      }
      return RESULT;
    },
  },
  {
    url: "/user/update/account1",
    method: "post",
    response: () => {
      RESULT.code = 404;
      RESULT.data = {
        page:'account'
      }
      return RESULT;
    },
  },
];
