/*
 Navicat Premium Data Transfer

 Source Server         : 本地测试mysql
 Source Server Type    : MySQL
 Source Server Version : 80402 (8.4.2)
 Source Host           : localhost:3306
 Source Schema         : rbac_dev

 Target Server Type    : MySQL
 Target Server Version : 80402 (8.4.2)
 File Encoding         : 65001

 Date: 30/09/2025 00:09:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `_id` int NOT NULL AUTO_INCREMENT COMMENT '表索引',
  `id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '业务ID',
  `created_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '创建者',
  `updated_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '更新者',
  `deleted_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '删除者',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '状态',
  `parent_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '父部门ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '部门名',
  `dept_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '部门编码',
  `leader_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '部门负责人ID',
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '部门邮箱',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '部门电话',
  PRIMARY KEY (`_id`) USING BTREE,
  UNIQUE INDEX `IDX_bcff95950c9e1012cf91f2d313`(`id` ASC) USING BTREE,
  UNIQUE INDEX `IDX_45bf495156783376b6c205b277`(`name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_8de1d0afefb0b0c6b18fc9d2c6`(`dept_code` ASC) USING BTREE,
  UNIQUE INDEX `IDX_5fb12798a9801f46b7585b16c0`(`name` ASC, `dept_code` ASC, `email` ASC, `phone` ASC) USING BTREE,
  UNIQUE INDEX `IDX_1e3eab73c41715c06e36b3183e`(`email` ASC) USING BTREE,
  UNIQUE INDEX `IDX_9bed6207ead4e7f46cd4f3ff2b`(`phone` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '部门表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------

-- ----------------------------
-- Table structure for sys_dept_tree
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept_tree`;
CREATE TABLE `sys_dept_tree`  (
  `ancestor_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '祖先部门ID',
  `descendant_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '后代部门ID',
  `depth` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '路径长度(0 表示自己)',
  PRIMARY KEY (`ancestor_id`, `descendant_id`) USING BTREE,
  UNIQUE INDEX `IDX_33cac3889785ddc3812cda5bdb`(`ancestor_id` ASC, `descendant_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '部门树表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept_tree
-- ----------------------------

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `_id` int NOT NULL AUTO_INCREMENT COMMENT '表索引',
  `id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '业务ID',
  `created_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '创建者',
  `updated_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '更新者',
  `deleted_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '删除者',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '状态',
  `parent_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '父菜单ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '菜单名',
  `menu_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '菜单编码',
  `path` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '访问路径',
  `query` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '路由参数',
  `component` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '组件路径',
  `route_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '路由名称',
  `icon` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '图标地址',
  `is_cache` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '是否缓存',
  `is_visible` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '是否隐藏',
  `menu_type` tinyint UNSIGNED NOT NULL DEFAULT 10 COMMENT '菜单类型',
  PRIMARY KEY (`_id`) USING BTREE,
  UNIQUE INDEX `IDX_8b22e66a03950819c40639e58f`(`id` ASC) USING BTREE,
  UNIQUE INDEX `IDX_300914d18f3d16b0c3a631e8be`(`name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_a859aebc4e3f8198e25bd246e9`(`menu_code` ASC) USING BTREE,
  UNIQUE INDEX `IDX_ceb93f4489d1b59106b8a55c68`(`name` ASC, `menu_code` ASC, `route_name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_cd5541c0d291ebc709b07d4ef5`(`route_name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '菜单表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------

-- ----------------------------
-- Table structure for sys_menu_tree
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu_tree`;
CREATE TABLE `sys_menu_tree`  (
  `ancestor_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '祖先菜单ID',
  `descendant_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '后代菜单ID',
  `depth` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '路径长度(0 表示自己)',
  PRIMARY KEY (`ancestor_id`, `descendant_id`) USING BTREE,
  UNIQUE INDEX `IDX_5dfdcb2e840e6b320536ba3ca8`(`ancestor_id` ASC, `descendant_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '菜单树表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu_tree
-- ----------------------------

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission`  (
  `_id` int NOT NULL AUTO_INCREMENT COMMENT '表索引',
  `id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '业务ID',
  `created_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '创建者',
  `updated_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '更新者',
  `deleted_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '删除者',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '状态',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '权限名',
  `permission_code` varchar(41) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '权限编码(领域:操作类型)',
  `domain` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '领域',
  `action_type` tinyint UNSIGNED NOT NULL DEFAULT 10 COMMENT '操作类型',
  PRIMARY KEY (`_id`) USING BTREE,
  UNIQUE INDEX `IDX_e5cdbeb5631906e69288794de6`(`name` ASC, `permission_code` ASC) USING BTREE,
  UNIQUE INDEX `IDX_007ea20aaa05db860bcba9cd62`(`id` ASC) USING BTREE,
  UNIQUE INDEX `IDX_15b2baa4e0f6c57a662f9bf83f`(`name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_8d14d3178d52965ddbc55aab6d`(`permission_code` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '权限表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------

-- ----------------------------
-- Table structure for sys_permission_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission_menu`;
CREATE TABLE `sys_permission_menu`  (
  `permission_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `menu_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`permission_id`, `menu_id`) USING BTREE,
  INDEX `IDX_ad447d7f9de30d03f21225a547`(`permission_id` ASC) USING BTREE,
  INDEX `IDX_27f018e854806f75e11bc5b8ca`(`menu_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_permission_menu
-- ----------------------------

-- ----------------------------
-- Table structure for sys_permission_resource
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission_resource`;
CREATE TABLE `sys_permission_resource`  (
  `permission_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `resource_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`permission_id`, `resource_id`) USING BTREE,
  INDEX `IDX_f5a3de964102ccbf8176b1b898`(`permission_id` ASC) USING BTREE,
  INDEX `IDX_70e4955b9e3d95fb0762f0858a`(`resource_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_permission_resource
-- ----------------------------

-- ----------------------------
-- Table structure for sys_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_post`;
CREATE TABLE `sys_post`  (
  `_id` int NOT NULL AUTO_INCREMENT COMMENT '表索引',
  `id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '业务ID',
  `created_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '创建者',
  `updated_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '更新者',
  `deleted_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '删除者',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '状态',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '岗位名',
  `post_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '岗位编码',
  `dept_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '业务ID',
  PRIMARY KEY (`_id`) USING BTREE,
  UNIQUE INDEX `IDX_f5d6f57d2dba7c57f4c40022c4`(`name` ASC, `post_code` ASC) USING BTREE,
  UNIQUE INDEX `IDX_1e5088d9d1e7f7000826a3e7db`(`id` ASC) USING BTREE,
  UNIQUE INDEX `IDX_3f27373fb24c80bac00de970de`(`name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_eef599f6625151a08f33eb095d`(`post_code` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '岗位表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_post
-- ----------------------------

-- ----------------------------
-- Table structure for sys_resource
-- ----------------------------
DROP TABLE IF EXISTS `sys_resource`;
CREATE TABLE `sys_resource`  (
  `_id` int NOT NULL AUTO_INCREMENT COMMENT '表索引',
  `id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '业务ID',
  `created_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '创建者',
  `updated_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '更新者',
  `deleted_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '删除者',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '状态',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '资源名',
  `resource_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '资源编码(资源类型:请求类型:资源路径)',
  `method_type` tinyint UNSIGNED NOT NULL DEFAULT 10 COMMENT '请求类型',
  `path` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '资源路径',
  `resource_type` tinyint UNSIGNED NOT NULL DEFAULT 10 COMMENT '资源类型',
  PRIMARY KEY (`_id`) USING BTREE,
  UNIQUE INDEX `IDX_b9337ccbffb99c59552ada4414`(`name` ASC, `resource_code` ASC) USING BTREE,
  UNIQUE INDEX `IDX_3d090cb7a227480d38b9445d1e`(`id` ASC) USING BTREE,
  UNIQUE INDEX `IDX_028d68e0274c53c31c24c44890`(`name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_ead7bf75bab8f20d55fd757158`(`resource_code` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '资源表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_resource
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `_id` int NOT NULL AUTO_INCREMENT COMMENT '表索引',
  `id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '业务ID',
  `created_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '创建者',
  `updated_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '更新者',
  `deleted_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '删除者',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '状态',
  `parent_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '父角色ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '角色名',
  `role_code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '角色编码',
  PRIMARY KEY (`_id`) USING BTREE,
  UNIQUE INDEX `IDX_ca11726829c33f34f47d4fef2e`(`name` ASC, `role_code` ASC) USING BTREE,
  UNIQUE INDEX `IDX_12875ba0686cf845f353704dc7`(`id` ASC) USING BTREE,
  UNIQUE INDEX `IDX_223de54d6badbe43a5490450c3`(`name` ASC) USING BTREE,
  UNIQUE INDEX `IDX_fd8cc60f0258a8d5948141d98e`(`role_code` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (1, '9a596d94-1946-4c9b-9899-d8b2f224dbf0', '8f4ec0c5-fd55-474a-b03a-9bd776278b82', '8f4ec0c5-fd55-474a-b03a-9bd776278b82', NULL, '2025-09-26 14:57:00.122000', '2025-09-26 14:57:00.122000', NULL, 'system_create', 20, NULL, '超级管理员', 'SUPER');
INSERT INTO `sys_role` VALUES (2, '490bfe48-ae3c-4ed6-a661-c0a039c871fe', '8f4ec0c5-fd55-474a-b03a-9bd776278b82', '8f4ec0c5-fd55-474a-b03a-9bd776278b82', NULL, '2025-09-26 14:57:29.017000', '2025-09-26 14:57:29.017000', NULL, 'system_create', 20, '9a596d94-1946-4c9b-9899-d8b2f224dbf0', '管理员', 'ADMIN');
INSERT INTO `sys_role` VALUES (3, 'a12f7feb-c9e3-40c1-afa9-87e42bf3ae10', '8f4ec0c5-fd55-474a-b03a-9bd776278b82', '8f4ec0c5-fd55-474a-b03a-9bd776278b82', NULL, '2025-09-26 14:58:05.578000', '2025-09-26 14:58:05.578000', NULL, 'system_create', 20, '490bfe48-ae3c-4ed6-a661-c0a039c871fe', '普通角色', 'USER');

-- ----------------------------
-- Table structure for sys_role_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_dept`;
CREATE TABLE `sys_role_dept`  (
  `role_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `dept_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`role_id`, `dept_id`) USING BTREE,
  INDEX `IDX_b6c20295bc00028ecadc01a36a`(`role_id` ASC) USING BTREE,
  INDEX `IDX_aa042b446e961857482a98d745`(`dept_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_dept
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission`  (
  `role_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `permission_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`) USING BTREE,
  INDEX `IDX_cafe50ffac8beaf0e03bc9a474`(`role_id` ASC) USING BTREE,
  INDEX `IDX_212c96df7321e7be66634bb554`(`permission_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_permission
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role_tree
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_tree`;
CREATE TABLE `sys_role_tree`  (
  `ancestor_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '祖先角色ID',
  `descendant_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '后代角色ID',
  `depth` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '路径长度(0 表示自己)',
  PRIMARY KEY (`ancestor_id`, `descendant_id`) USING BTREE,
  UNIQUE INDEX `IDX_a44ce595a94aea696c315bd5cf`(`ancestor_id` ASC, `descendant_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '角色树表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_tree
-- ----------------------------
INSERT INTO `sys_role_tree` VALUES ('490bfe48-ae3c-4ed6-a661-c0a039c871fe', '490bfe48-ae3c-4ed6-a661-c0a039c871fe', 0);
INSERT INTO `sys_role_tree` VALUES ('490bfe48-ae3c-4ed6-a661-c0a039c871fe', 'a12f7feb-c9e3-40c1-afa9-87e42bf3ae10', 1);
INSERT INTO `sys_role_tree` VALUES ('9a596d94-1946-4c9b-9899-d8b2f224dbf0', '490bfe48-ae3c-4ed6-a661-c0a039c871fe', 1);
INSERT INTO `sys_role_tree` VALUES ('9a596d94-1946-4c9b-9899-d8b2f224dbf0', '9a596d94-1946-4c9b-9899-d8b2f224dbf0', 0);
INSERT INTO `sys_role_tree` VALUES ('9a596d94-1946-4c9b-9899-d8b2f224dbf0', 'a12f7feb-c9e3-40c1-afa9-87e42bf3ae10', 2);
INSERT INTO `sys_role_tree` VALUES ('a12f7feb-c9e3-40c1-afa9-87e42bf3ae10', 'a12f7feb-c9e3-40c1-afa9-87e42bf3ae10', 0);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `_id` int NOT NULL AUTO_INCREMENT COMMENT '表索引',
  `id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '业务ID',
  `created_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '创建者',
  `updated_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '更新者',
  `deleted_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '删除者',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '状态',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `pwd` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NOT NULL COMMENT '密码',
  `login_ip` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '最后登录的IP',
  `login_at` datetime(6) NULL DEFAULT NULL COMMENT '最后登录时间',
  `pwd_update_at` datetime(6) NULL DEFAULT NULL COMMENT '密码最后更新时间',
  `pwd_update_By` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '密码最后更新者',
  `salt` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '盐值',
  `profile_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '业务ID',
  `post_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '业务ID',
  PRIMARY KEY (`_id`) USING BTREE,
  UNIQUE INDEX `IDX_b286272b5d723fa76dca97a159`(`id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (1, 'd00b40ab-aff4-443d-b33b-001dd79d35d2', 'system', 'd00b40ab-aff4-443d-b33b-001dd79d35d2', NULL, '2025-09-30 00:05:12.239000', '2025-09-30 00:07:49.184000', NULL, 'system_create', 20, 'super', '39c4d059c69b37d44a41ca49abfc1c21094bed6e2cff9ffee6b29e5f66d3a817', '127.0.0.1', '2025-09-30 00:06:15.464000', NULL, NULL, '757bdb0f-9af7-40a8-8e5c-0a42fc43028c', '9b4eec59-20f9-4db8-9e0c-3a7dba0f3226', NULL);

-- ----------------------------
-- Table structure for sys_user_profile
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_profile`;
CREATE TABLE `sys_user_profile`  (
  `_id` int NOT NULL AUTO_INCREMENT COMMENT '表索引',
  `id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL COMMENT '业务ID',
  `created_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '创建者',
  `updated_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT 'sys' COMMENT '更新者',
  `deleted_by` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NULL DEFAULT NULL COMMENT '删除者',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  `deleted_at` datetime(6) NULL DEFAULT NULL COMMENT '删除时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '备注',
  `status` tinyint UNSIGNED NOT NULL DEFAULT 20 COMMENT '状态',
  `nick_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '用户别名',
  `sex` tinyint UNSIGNED NOT NULL DEFAULT 10 COMMENT '性别',
  `birthday` date NULL DEFAULT NULL COMMENT '出生日期',
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '用户邮箱',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci NULL DEFAULT NULL COMMENT '电话号码',
  `avatar` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'https://cn.cravatar.com/avatar/' COMMENT '头像地址',
  PRIMARY KEY (`_id`) USING BTREE,
  UNIQUE INDEX `IDX_56032560d4ea45a4d12c701f1f`(`id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci COMMENT = '用户档案表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_profile
-- ----------------------------
INSERT INTO `sys_user_profile` VALUES (1, '9b4eec59-20f9-4db8-9e0c-3a7dba0f3226', 'system', 'system', NULL, '2025-09-30 00:05:12.239000', '2025-09-30 00:05:12.239000', NULL, 'system_create', 20, '', 10, NULL, 'Aa123456@qq.com', NULL, 'https://cn.cravatar.com/avatar/f41fcd1c2d161504d9d68494e3427ba9');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `user_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `role_id` varchar(36) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE,
  INDEX `IDX_71b4edf9aedbd3e5707156e80a`(`user_id` ASC) USING BTREE,
  INDEX `IDX_e8300bfcf561ed417f5f02c677`(`role_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_520_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES ('d00b40ab-aff4-443d-b33b-001dd79d35d2', '9a596d94-1946-4c9b-9899-d8b2f224dbf0');

SET FOREIGN_KEY_CHECKS = 1;
