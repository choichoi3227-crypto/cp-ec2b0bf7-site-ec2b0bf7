<?php
/**
 * CloudPress — WordPress SQLite db.php drop-in (자동 생성)
 * sqlite-database-integration 플러그인과 _db/wordpress.db 를 사용합니다.
 */
if ( ! defined( 'DB_DIR' ) ) {
    define( 'DB_DIR', dirname( __DIR__, 2 ) . '/_db/' );
}
if ( ! defined( 'DB_FILE' ) ) {
    define( 'DB_FILE', 'wordpress.db' );
}
if ( ! defined( 'DB_ENGINE' ) ) {
    define( 'DB_ENGINE', 'sqlite' );
}
$_cp_sqlite = __DIR__ . '/plugins/sqlite-database-integration/load.php';
if ( is_readable( $_cp_sqlite ) ) {
    require_once $_cp_sqlite;
}
