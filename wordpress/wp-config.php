<?php
/**
 * CloudPress WordPress 설정 (자동 생성)
 * DB: GitHub 레포 내 _db/wordpress.db (SQLite)
 */

// ── SQLite 연동 (sqlite-database-integration 플러그인) ──
define( 'DB_NAME',     'wordpress' );
define( 'DB_USER',     'root' );
define( 'DB_PASSWORD', '' );
define( 'DB_HOST',     'localhost' );
define( 'DB_CHARSET',  'utf8mb4' );
define( 'DB_COLLATE',  '' );
define( 'table_prefix', 'wp_' );

// SQLite 플러그인 설정 (DB_DIR/DB_FILE이 실제 사용되는 상수)
define( 'DB_DIR',  __DIR__ . '/../_db/' );
define( 'DB_FILE', 'wordpress.db' );

// ── 인증 키/솔트 ──
define( 'AUTH_KEY',         'v3rukv559nw86yiy49mrw7tenyo390lgytwfh6k3bfa9cgecb8l8f5prau8uhmme' );
define( 'SECURE_AUTH_KEY',  'gsx9msm2g5lhfdwkwey8pgqcx0yyreqwiv82jd2x5sujk35i2vf8xx6hzz13u44h' );
define( 'LOGGED_IN_KEY',    '46idzuq18qpnrkmwdb1dmne6shc2jjjo0qnotefe1xebexqwqo8g4uio8kzsaj88' );
define( 'NONCE_KEY',        'qqr0fkcyi993zha035vtjxu8yuqodvntsfj74t7ohqh0csrics40d83pro9sud9e' );
define( 'AUTH_SALT',        'nbw67a6fqnq8kmyjsexmnfczyazifgv8x21w1n3jcq5vvj0kisc8d0agudf8p24l' );
define( 'SECURE_AUTH_SALT', 'v4f5wrhbccl86qb4bazlvcyndxape67x4qtmgfazh9a3x5nxih5nucfmzyz93hx4' );
define( 'LOGGED_IN_SALT',   'bd1rokio54rg1mrcnk3j4qnc784eddy89chyfeykft9oiv7izjnk0e403bt42x3k' );
define( 'NONCE_SALT',       'w05j4zcsvdixdaq3h83ivflzv0vphn83u7rezufc9bhf0zgsaaktyan98n7rbkiq' );

// ── URL 설정 ──
define( 'WP_HOME',    'https://cp-ec2b0bf7-wp.workers.dev' );
define( 'WP_SITEURL', 'https://cp-ec2b0bf7-wp.workers.dev' );

// ── 기타 ──
define( 'WP_DEBUG',        false );
define( 'WP_CACHE',        true  );
define( 'WP_AUTO_UPDATE_CORE', false );
define( 'DISALLOW_FILE_EDIT',  false );

if ( ! defined( 'ABSPATH' ) ) {
  define( 'ABSPATH', __DIR__ . '/' );
}
require_once ABSPATH . 'wp-settings.php';
