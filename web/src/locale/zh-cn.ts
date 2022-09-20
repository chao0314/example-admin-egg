export const locale = {
    singIn: '登录',
    singUp: '注册',
    singOut: '登出',
    username: '用户名',
    password: '密码',
    password2: '确认密码',
    emailOrPhone: '邮箱或手机号',
    checkUsername: '请输入用户名,可以是数字、字母、下划线',
    checkPassword: '需同时包含大小写字母和数字，最少6位，最多10位',
    verificationCode: '验证码',
    checkCode: '格式有误',
    account: '账户',
    checkAccount: '账户格式有误',
    dynamicCode: '动态码',
    otherSingIn: '其他登录方式',
    passwordConfirm: '两次密码不一致',
    query: '查询',
    exportSearchResult: '导出搜索结果',
    createUser: '添加用户',
    importUser: '导入用户',
    role: '角色',
    state: '状态',
    operation: '操作',
    email: '邮箱',
    phone: '电话',
    cancel: '取消',
    confirm: '确认',
    userManagement: '用户管理',
    permissionManagement: '权限管理',
    userList: '用户列表',
    roleList: '角色列表',
    permissionList: '权限列表',
    routeMap: {
        index: '首页',
        user: '用户管理',
        'user/list': '用户列表',
        permission: '权限管理',
        'permission/role': '角色列表',
        'permission/list': '权限列表'

    }

}

export type Locale = typeof locale;