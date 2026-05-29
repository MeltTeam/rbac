# CLAUDE.md — packages/types

共享 TypeScript 类型包（DTO/VO/枚举），Rollup 构建 CJS+ESM+d.ts。被 `@apps/api` 和 `@apps/uni` 消费。

## 常用命令

```bash
pnpm build    # Rollup 构建（dist/index.mjs + index.js + index.cjs + index.d.ts）
pnpm g        # Plop 生成 DTO/VO 类型文件
pnpm lint     # format + eslint 检查
pnpm lint:fix # format + eslint 修复
```

## 结构

- `src/dto/` — 数据传输对象（输入类型）：IAuth/ICommon/IDeptRole/IMenu/IPostRole/IResource/IRole/IRoleMenu/IRoleResource/ISysDept/ISysPost/IUser/IUserPost/IUserRole 等
- `src/vo/` — 视图对象（输出类型）：IAuth/ICommon/IMenu/IResource/IRole/ISysDept/ISysPost/IUser 等
- `src/enums/` — 枚举：actionType/captchaType/check/dataScope/httpStatus/loginType/menuType/orderByType/orderType/resourceType/sex/sort/status 等
- `src/index.ts` — 统一导出（re-export dto + enums + vo）

## 注意

`preinstall` hook 自动执行 `pnpm build`，修改源码后安装依赖会触发重建。手动修改后需执行 `pnpm build`。
