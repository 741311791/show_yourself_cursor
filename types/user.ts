export interface User {
    id: string;          // 用户唯一标识
    username: string;    // 用户名
    email: string;       // 电子邮件
    password: string;    // 加密后的密码
    salt?: string;       // 密码加密盐值
    role: UserRole;      // 用户角色
    status: UserStatus;  // 用户状态
    createdAt: Date;     // 创建时间
    updatedAt: Date;     // 更新时间
    lastLoginAt?: Date;  // 最后登录时间
    isDeleted: boolean;  // 是否删除
    deletedAt?: Date;    // 删除时间
  }
  
  export enum UserRole {
    ADMIN = 'admin',
    COMMON_USER = 'common_user',
    VIP_USER = 'vip_user'
  }
  
  export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BANNED = 'banned'
  }
  
  // 登录请求体
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  // 登录响应体
  export interface LoginResponse {
    token: string;           // JWT token
    user: Omit<User, 'password' | 'salt'>;  // 不返回敏感信息
  }

