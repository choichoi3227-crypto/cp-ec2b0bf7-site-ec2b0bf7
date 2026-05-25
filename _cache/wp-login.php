<br />
<b>Fatal error</b>:  Uncaught PDOException: SQLSTATE[HY000]: General error: 26 file is not a database in /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-content/plugins/sqlite-database-integration/wp-includes/sqlite/class-wp-sqlite-translator.php:402
Stack trace:
#0 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-content/plugins/sqlite-database-integration/wp-includes/sqlite/class-wp-sqlite-translator.php(402): PDO-&gt;query('CREATE TABLE IF...')
#1 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-content/plugins/sqlite-database-integration/wp-includes/sqlite/class-wp-sqlite-db.php(354): WP_SQLite_Translator-&gt;__construct(Object(Pdo\Sqlite))
#2 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-includes/class-wpdb.php(772): WP_SQLite_DB-&gt;db_connect()
#3 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-content/plugins/sqlite-database-integration/wp-includes/sqlite/class-wp-sqlite-db.php(55): wpdb-&gt;__construct('', Object(SensitiveParameterValue), 'database_name_h...', '')
#4 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-content/plugins/sqlite-database-integration/wp-includes/sqlite/db.php(89): WP_SQLite_DB-&gt;__construct('database_name_h...')
#5 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-content/db.php(37): require_once('/home/runner/wo...')
#6 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-includes/load.php(712): require_once('/home/runner/wo...')
#7 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-settings.php(136): require_wp_db()
#8 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-config.php(21): require_once('/home/runner/wo...')
#9 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-load.php(50): require_once('/home/runner/wo...')
#10 /home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-login.php(12): require('/home/runner/wo...')
#11 {main}
  thrown in <b>/home/runner/work/cp-ec2b0bf7-site-ec2b0bf7/cp-ec2b0bf7-site-ec2b0bf7/wordpress/wp-content/plugins/sqlite-database-integration/wp-includes/sqlite/class-wp-sqlite-translator.php</b> on line <b>402</b><br />
