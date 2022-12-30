export default [
  {
    url:"/test_mock",
    method:"get",
    response: () => {
      debugger
      return "Hello mockjs";
    }
  }
]
