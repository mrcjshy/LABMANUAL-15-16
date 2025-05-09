
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    private final DatabaseConfig dbConfig;
    private static boolean driverLoaded = false;

    public DatabaseConnection(DatabaseConfig dbConfig) {
        this.dbConfig = dbConfig;
        loadDriver();
    }

    private void loadDriver() {
        if (!driverLoaded) {
            try {
                // Try multiple driver class names for different MySQL connector versions
                try {
                    Class.forName("com.mysql.cj.jdbc.Driver");
                    System.out.println("MySQL JDBC Driver loaded successfully (com.mysql.cj.jdbc.Driver)");
                    driverLoaded = true;
                } catch (ClassNotFoundException e1) {
                    try {
                        // Try older driver name
                        Class.forName("com.mysql.jdbc.Driver");
                        System.out.println("MySQL JDBC Driver loaded successfully (com.mysql.jdbc.Driver)");
                        driverLoaded = true;
                    } catch (ClassNotFoundException e2) {
                        System.err.println("MySQL JDBC Driver not found! Make sure mysql-connector-j-9.3.0.jar is in your classpath.");
                        e2.printStackTrace();
                    }
                }
            } catch (Exception e) {
                System.err.println("Error loading MySQL driver!");
                e.printStackTrace();
            }
        }
    }

    public Connection getConnection() throws SQLException {
        if (!driverLoaded) {
            loadDriver();
        }

        String url = dbConfig.getDatabaseUrl();
        // Only add parameters if they're not already present
        if (!url.contains("?")) {
            url += "?allowPublicKeyRetrieval=true&useSSL=false";
        }

        System.out.println("Connecting to: " + url);
        return DriverManager.getConnection(url, dbConfig.getUsername(), dbConfig.getPassword());
    }
}
