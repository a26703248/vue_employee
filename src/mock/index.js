let RESULT = {
  code: 200,
  msg: "",
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
    url: "/userProfile",
    method: "get",
    response: () => {
      RESULT.data = {
        avatar: "#",
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
];
