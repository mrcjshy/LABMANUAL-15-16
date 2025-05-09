
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.io.File;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class Crud1 {

    // Static block to load MySQL driver when the class is loaded
    static {
        try {
            System.out.println("Loading MySQL JDBC driver...");

            // Check if MySQL connector JAR exists
            File jarFile = new File("lib/mysql-connector-j-9.3.0.jar");
            if (jarFile.exists()) {
                System.out.println("MySQL connector JAR found at: " + jarFile.getAbsolutePath());
            } else {
                System.err.println("WARNING: MySQL connector JAR not found at: " + jarFile.getAbsolutePath());
            }

            // Try loading the driver with both current and legacy class names
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                System.out.println("MySQL JDBC driver loaded successfully (com.mysql.cj.jdbc.Driver)!");
            } catch (ClassNotFoundException e1) {
                try {
                    Class.forName("com.mysql.jdbc.Driver");
                    System.out.println("MySQL JDBC driver loaded successfully (com.mysql.jdbc.Driver)!");
                } catch (ClassNotFoundException e2) {
                    System.err.println("ERROR: MySQL JDBC driver not found!");
                    e2.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("ERROR loading driver:");
            e.printStackTrace();
        }
    }

    private JTextField nameField;
    private JTextField emailField;
    private JTextArea displayArea;
    private int offset;
    private final DatabaseConfig dbConfig;
    private final DatabaseConnection dbConnection;

    public Crud1() {
        // Initialize DatabaseConfig with connection details
        dbConfig = new DatabaseConfig("root", "", "jdbc:mysql://localhost:3306/myoop");
        dbConnection = new DatabaseConnection(dbConfig);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new Crud1().createAndShowGUI();
        });
    }

    private void createAndShowGUI() {
        offset = 0;

        JFrame frame = new JFrame("User Management");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setPreferredSize(new Dimension(400, 600));

        JPanel mainPanel = new JPanel(new GridBagLayout());
        GridBagConstraints mainConstraints = new GridBagConstraints();
        mainConstraints.insets = new Insets(5, 5, 5, 5);
        mainConstraints.fill = GridBagConstraints.HORIZONTAL;

        // Title
        JLabel titleLabel = new JLabel("Pateros Technological College", JLabel.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 16));
        mainConstraints.gridx = 0;
        mainConstraints.gridy = 0;
        mainConstraints.gridwidth = 2;
        mainPanel.add(titleLabel, mainConstraints);

        // Subtitle
        JLabel subtitleLabel = new JLabel("Object Oriented Programming - JDBC", JLabel.CENTER);
        subtitleLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        mainConstraints.gridy = 1;
        mainPanel.add(subtitleLabel, mainConstraints);

        // Empty space
        mainConstraints.gridy = 2;
        mainPanel.add(new JLabel(" "), mainConstraints);

        // System name
        JLabel systemNameLabel = new JLabel("SAMPLE CRUD DATABASE", JLabel.CENTER);
        systemNameLabel.setFont(new Font("Arial", Font.BOLD, 18));
        mainConstraints.gridy = 3;
        mainPanel.add(systemNameLabel, mainConstraints);

        // Empty spaces
        mainConstraints.gridy = 4;
        mainPanel.add(new JLabel(" "), mainConstraints);

        // Record container
        JPanel recordPanel = new JPanel(new GridBagLayout());
        recordPanel.setBorder(BorderFactory.createTitledBorder("Data Manipulation"));
        GridBagConstraints recordConstraints = new GridBagConstraints();
        recordConstraints.insets = new Insets(5, 2, 5, 2);
        recordConstraints.fill = GridBagConstraints.HORIZONTAL;

        JLabel nameLabel = new JLabel("Name:");
        recordConstraints.gridx = 0;
        recordConstraints.gridy = 0;
        recordConstraints.weightx = 0.0;
        recordConstraints.fill = GridBagConstraints.NONE;
        recordPanel.add(nameLabel, recordConstraints);

        nameField = new JTextField(30);
        nameField.setPreferredSize(new Dimension(250, 30));
        recordConstraints.gridx = 1;
        recordConstraints.gridy = 0;
        recordConstraints.weightx = 1.0;
        recordConstraints.fill = GridBagConstraints.HORIZONTAL;
        recordConstraints.insets = new Insets(5, 0, 5, 5);
        recordPanel.add(nameField, recordConstraints);

        JLabel emailLabel = new JLabel("Email:");
        recordConstraints.gridx = 0;
        recordConstraints.gridy = 1;
        recordConstraints.weightx = 0.0;
        recordConstraints.fill = GridBagConstraints.NONE;
        recordConstraints.insets = new Insets(5, 2, 5, 2);
        recordPanel.add(emailLabel, recordConstraints);

        emailField = new JTextField(30);
        emailField.setPreferredSize(new Dimension(250, 30));
        recordConstraints.gridx = 1;
        recordConstraints.gridy = 1;
        recordConstraints.weightx = 1.0;
        recordConstraints.fill = GridBagConstraints.HORIZONTAL;
        recordConstraints.insets = new Insets(5, 0, 5, 5);
        recordPanel.add(emailField, recordConstraints);

        JButton clearButton = new JButton("Clear");
        clearButton.addActionListener(e -> {
            nameField.setText("");
            emailField.setText("");
        });
        recordConstraints.gridx = 0;
        recordConstraints.gridy = 2;
        recordConstraints.gridwidth = 2;
        recordConstraints.anchor = GridBagConstraints.CENTER;
        recordPanel.add(clearButton, recordConstraints);

        mainConstraints.gridy = 7;
        mainConstraints.gridwidth = 2;
        mainPanel.add(recordPanel, mainConstraints);

        // Record Transactions container
        JPanel transactionPanel = new JPanel(new GridBagLayout());
        transactionPanel.setBorder(BorderFactory.createTitledBorder("Record Transactions"));
        GridBagConstraints transactionConstraints = new GridBagConstraints();
        transactionConstraints.insets = new Insets(5, 5, 5, 5);
        transactionConstraints.fill = GridBagConstraints.HORIZONTAL;

        // Action buttons
        JButton addButton = new JButton("Add User");
        addButton.addActionListener(e -> {
            AddUser addUser = new AddUser(dbConnection);
            String name = nameField.getText();
            String email = emailField.getText();

            if (name.isEmpty() || email.isEmpty()) {
                JOptionPane.showMessageDialog(frame, "Name and email cannot be empty!", "Input Error", JOptionPane.ERROR_MESSAGE);
                return;
            }

            boolean success = addUser.addUser(name, email);
            if (success) {
                JOptionPane.showMessageDialog(frame, "User added successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                nameField.setText("");
                emailField.setText("");
            } else {
                JOptionPane.showMessageDialog(frame, "Failed to add user. Please check the console for details.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
        transactionConstraints.gridx = 0;
        transactionConstraints.gridy = 0;
        transactionPanel.add(addButton, transactionConstraints);

        JButton showButton = new JButton("Show Records");
        showButton.addActionListener(e -> {
            ShowRecords showRecords = new ShowRecords(dbConnection);
            displayArea.setText(showRecords.getRecords(offset));
            offset += 10;
        });
        transactionConstraints.gridy = 1;
        transactionPanel.add(showButton, transactionConstraints);

        JButton searchButton = new JButton("Search");
        searchButton.addActionListener(e -> {
            SearchUser searchUser = new SearchUser(dbConnection);
            String idString = JOptionPane.showInputDialog(null, "Enter ID to search:");
            if (idString != null && !idString.isEmpty()) {
                try {
                    int id = Integer.parseInt(idString);
                    displayArea.setText(searchUser.searchById(id));
                } catch (NumberFormatException ex) {
                    System.out.println("Invalid ID. Please enter a valid number.");
                }
            }
        });
        transactionConstraints.gridy = 2;
        transactionPanel.add(searchButton, transactionConstraints);

        JButton editButton = new JButton("Edit");
        editButton.addActionListener(e -> {
            EditUser editUser = new EditUser(dbConnection);
            String idString = JOptionPane.showInputDialog(null, "Enter ID to edit:");
            if (idString != null && !idString.isEmpty()) {
                try {
                    int id = Integer.parseInt(idString);
                    String newName = JOptionPane.showInputDialog(null, "Enter new name:");
                    String newEmail = JOptionPane.showInputDialog(null, "Enter new email:");
                    if (newName != null && !newName.isEmpty() && newEmail != null && !newEmail.isEmpty()) {
                        boolean success = editUser.editUser(id, newName, newEmail);
                        if (success) {
                            JOptionPane.showMessageDialog(frame, "User updated successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                        } else {
                            JOptionPane.showMessageDialog(frame, "Failed to update user. User ID may not exist.", "Error", JOptionPane.ERROR_MESSAGE);
                        }
                    } else {
                        JOptionPane.showMessageDialog(frame, "Name and email cannot be empty!", "Input Error", JOptionPane.ERROR_MESSAGE);
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(frame, "Invalid ID. Please enter a valid number.", "Input Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });
        transactionConstraints.gridy = 3;
        transactionPanel.add(editButton, transactionConstraints);

        JButton deleteButton = new JButton("Delete");
        deleteButton.addActionListener(e -> {
            DeleteUser deleteUser = new DeleteUser(dbConnection);
            String idString = JOptionPane.showInputDialog(null, "Enter ID to delete:");
            if (idString != null && !idString.isEmpty()) {
                try {
                    int id = Integer.parseInt(idString);

                    int confirm = JOptionPane.showConfirmDialog(
                            frame,
                            "Are you sure you want to delete user with ID " + id + "?",
                            "Confirm Deletion",
                            JOptionPane.YES_NO_OPTION,
                            JOptionPane.WARNING_MESSAGE);

                    if (confirm == JOptionPane.YES_OPTION) {
                        boolean success = deleteUser.deleteUser(id);
                        if (success) {
                            JOptionPane.showMessageDialog(frame, "User deleted successfully!", "Success", JOptionPane.INFORMATION_MESSAGE);
                        } else {
                            JOptionPane.showMessageDialog(frame, "Failed to delete user. User ID may not exist.", "Error", JOptionPane.ERROR_MESSAGE);
                        }
                    }
                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(frame, "Invalid ID. Please enter a valid number.", "Input Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });
        transactionConstraints.gridy = 4;
        transactionPanel.add(deleteButton, transactionConstraints);

        mainConstraints.gridy = 8;
        mainConstraints.gridwidth = 2;
        mainPanel.add(transactionPanel, mainConstraints);

        // Display area
        displayArea = new JTextArea(15, 40);
        displayArea.setEditable(false);
        displayArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        displayArea.setLineWrap(true);
        displayArea.setWrapStyleWord(true);
        JScrollPane scrollPane = new JScrollPane(displayArea);
        mainConstraints.gridy = 9;
        mainPanel.add(scrollPane, mainConstraints);

        // Footer
        JLabel footerLabel = new JLabel("Prepared by JSTJR 2024", JLabel.CENTER);
        footerLabel.setFont(new Font("Arial", Font.PLAIN, 12));
        mainConstraints.gridy = 10;
        mainPanel.add(footerLabel, mainConstraints);

        frame.add(mainPanel);
        frame.pack();
        frame.setVisible(true);
    }
}
