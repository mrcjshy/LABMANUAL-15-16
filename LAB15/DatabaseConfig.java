public class DatabaseConfig {
    private final String username;
    private final String password;
    private final String databaseUrl;

    public DatabaseConfig(String username, String password, String databaseUrl) {
        this.username = username;
        this.password = password;
        this.databaseUrl = databaseUrl;
    }

    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getDatabaseUrl() { return databaseUrl; }
} 