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
        page: "profile",
      };
      return RESULT;
    },
  },
  {
    url: "/user/update/account",
    method: "post",
    response: () => {
      RESULT.data = {
        page: "account",
      };
      return RESULT;
    },
  },
  {
    url: "/sys/main/nav",
    method: "get",
    response: () => {
      RESULT.data = {
        nav: [
          {
            title: "帳戶管理",
            name: "AccountMana",
            icon: "setting",
            component:"",
            path: "",
            pathParent:"",
            children: [
              {
                pathParent:"home",
                title: "帳戶設定",
                name: "AccountSetting",
                component:"sys/User",
                icon: "userFilled",
                path: "/sys/user",
              },
              {
                pathParent:"home",
                title: "權限設定",
                name: "RoleSetting",
                component:"sys/Roles",
                icon: "lock",
                path: "/sys/roles",
              },
              {
                pathParent:"home",
                title: "選單設定",
                name: "MenuSetting",
                component:"sys/Menu",
                icon: "document",
                path: "/sys/menu",
              },
            ],
          },
          {
            title: "系統工具",
            name: "SystemTool",
            icon: "operation",
            component:"",
            path: "",
            children: [],
          },
        ],
        authorities:[],
      };
      return RESULT;
    },
  },
];
