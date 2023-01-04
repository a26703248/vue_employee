let RESULT = {
  code: 200,
  msg: "success",
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
        authorities: [],
      };
      return RESULT;
    },
  },
  {
    url: "/sys/menu/list",
    method: "get",
    response: () => {
      RESULT.data = [
        {
          id: 1,
          created: "2022-01-01",
          updated: "2022-01-01",
          status: 1,
          parentId: 0,
          name: "帳戶管理",
          path: "",
          perms: "sys:manage",
          component: "",
          type: 0,
          icon: "setting",
          orderNum: 1,
          children: [
            {
              id: 12,
              created: "2022-01-01",
              updated: "2022-01-01",
              status: 1,
              parentId: 1,
              name: "帳號設定",
              path: "",
              perms: "sys:user",
              component: "",
              type: 1,
              icon: "user",
              orderNum: 1,
              children: [
                {
                  id: 121,
                  created: "2022-01-01",
                  updated: "2022-01-01",
                  status: 1,
                  parentId: 2,
                  name: "新增帳號",
                  path: "",
                  perms: "sys:user",
                  component: "",
                  type: 2,
                  icon: "user",
                  orderNum: 1,
                },
              ],
            },
          ],
        },
      ];
      return RESULT;
    },
  },
  // menu manager restAPI test
  {
    url: "/sys/menu/info/:id",
    method: "get",
    response: () => {
      RESULT.data = {
        id: 1,
        created: "2022-01-01",
        updated: "2022-01-01",
        status: 1,
        parentId: 1,
        name: "帳戶管理",
        path: "",
        perms: "sys:manage",
        component: "",
        type: 0,
        icon: "setting",
        orderNum: 1,
      };
      return RESULT;
    },
  },
  {
    url: "/sys/menu/update/:id",
    method: "post",
    response: () => {
      return RESULT;
    },
  },
  {
    url: "/sys/menu/save",
    method: "post",
    response: () => {
      return RESULT;
    },
  },
  {
    url: "/sys/menu/delete/:id",
    method: "post",
    response: () => {
      return RESULT;
    },
  },
  // role manager
  {
    url: RegExp("/sys/role/*"),
    method: "post",
    response: () => {
      return RESULT;
    },
  },
  {
    url: RegExp("/sys/role/info/*"),
    method: "get",
    response: () => {
      RESULT.data = {
        info: [
          {
            id: 1,
            name: "外部使用者",
            code: "anonymous",
            description: "text1",
            status: 1,
          },
        ],
        menuIds: [1, 12, 121],
      };
      return RESULT;
    },
  },
  {
    url: RegExp("/sys/role/list/*"),
    method: "get",
    response: () => {
      RESULT.data = {
        records: [
          {
            id: 1,
            name: "外部使用者",
            code: "anonymous",
            description: "text1",
            status: 1,
          },
          {
            id: 2,
            name: "管理者",
            code: "admin",
            description: "text2",
            status: 1,
          },
        ],
        pageSize: 10,
        total: 400,
        currentPage: 1,
      };
      return RESULT;
    },
  },
  {
    url: RegExp("/sys/role/perm/*"),
    method: "get",
    response: () => {
      return RESULT;
    },
  },
  // user manager
  {
    url: RegExp("/sys/user/*"),
    method: "post",
    response: () => {
      return RESULT;
    },
  },
  {
    url: RegExp("/sys/user/info/*"),
    method: "get",
    response: () => {
      RESULT.data = {
        info: {
          id: 1,
          avatar: "#",
          username: "admin",
          fullName: "管理員",
          roles: [{ name: "anonymous" }, { name: "admin" }],
          email: "XXX@gmail.com",
          mobile: "0911111111",
          status: 1,
          createdDate: "2022-01-01 00:00:00",
        },
        menuIds: [1, 2],
      };
      return RESULT;
    },
  },
  {
    url: RegExp("/sys/user/list/*"),
    method: "get",
    response: () => {
      RESULT.data = {
        records: [
          {
            id: 1,
            avatar: "#",
            username: "admin",
            fullName: "管理員",
            roles: [{ name: "anonymous" }, { name: "admin" }],
            email: "XXX@gmail.com",
            mobile: "0911111111",
            status: 1,
            createdDate: "2022-01-01 00:00:00",
          },
          {
            id: 2,
            avatar: "#",
            username: "develop",
            fullName: "開發人員",
            roles: [{ name: "anonymous" }],
            email: "XXX@gmail.com",
            mobile: "0911111111",
            status: 1,
            createdDate: "2022-01-01 00:00:00",
          },
        ],
        pageSize: 10,
        total: 400,
        currentPage: 1,
      };
      return RESULT;
    },
  },
  {
    url: RegExp("/sys/role/perm/*"),
    method: "get",
    response: () => {
      return RESULT;
    },
  },
  {
    url: RegExp("/sys/user/rest/password/*"),
    method: "post",
    response: () => {
      return RESULT;
    },
  },
];
