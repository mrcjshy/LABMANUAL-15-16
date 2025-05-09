
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    private final DatabaseConfig dbConfig;

    public DatabaseConnection(DatabaseConfig dbConfig) {
        this.dbConfig = dbConfig;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(dbConfig.getDatabaseUrl(), dbConfig.getUsername(), dbConfig.getPassword());
    }
}
