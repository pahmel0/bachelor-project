package com.attvin.config;

import com.attvin.model.*;
import com.attvin.repository.MaterialRepository;
import com.attvin.repository.MaterialPictureRepository;
import com.attvin.repository.UserRepository;
import com.attvin.repository.AuditTrailRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Initialize database with sample data
     */
    @Bean
    @Profile("!prod")
    public CommandLineRunner initDatabase(UserRepository userRepository, 
                                         MaterialRepository materialRepository,
                                         MaterialPictureRepository materialPictureRepository,
                                         AuditTrailRepository auditTrailRepository) {
        return args -> {
            logger.info("Initializing database with sample data");
            
            // Create test users
            List<User> users = createUsers(userRepository);
            
            // Create materials
            List<MaterialRecord> materials = createMaterials(materialRepository, materialPictureRepository);
            
            // Create audit trail entries
            createAuditTrail(auditTrailRepository, materials, users);
            
            logger.info("Sample data initialization complete");
        };
    }
    
    private List<User> createUsers(UserRepository userRepository) {
        // Check if users already exist
        if (userRepository.count() > 0) {
            logger.info("Users already exist, skipping user creation");
            return userRepository.findAll();
        }
        
        // Create admin user
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@example.com");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        Set<User.Role> adminRoles = new HashSet<>();
        adminRoles.add(User.Role.ADMIN);
        adminRoles.add(User.Role.USER);
        admin.setRoles(adminRoles);
        
        // Create regular user
        User user = new User();
        user.setName("Test User");
        user.setEmail("user@example.com");
        user.setPasswordHash(passwordEncoder.encode("user123"));
        Set<User.Role> userRoles = new HashSet<>();
        userRoles.add(User.Role.USER);
        user.setRoles(userRoles);
        
        // Save users
        List<User> savedUsers = userRepository.saveAll(Arrays.asList(admin, user));
        logger.info("Created test users: admin@example.com/admin123 and user@example.com/user123");
        
        return savedUsers;
    }
    
    private List<MaterialRecord> createMaterials(MaterialRepository materialRepository, 
                                MaterialPictureRepository materialPictureRepository) {
        // Check if materials already exist
        if (materialRepository.count() > 0) {
            logger.info("Materials already exist, skipping material creation");
            return materialRepository.findAll();
        }
        
        // Create a desk
        Desk desk = new Desk();
        desk.setName("Corner Office Desk");
        desk.setCategory("Desks");
        desk.setDateAdded(LocalDateTime.now().minusDays(5));
        desk.setMaterialCondition("Reusable");
        desk.setColor("Oak");
        desk.setNotes("Slightly scratched on the right side, otherwise in good condition");
        desk.setDeskType(Desk.DeskType.CORNER_DESK);
        desk.setHeightAdjustable(true);
        desk.setMaximumHeight(120.0);
        desk.setWidth(160.0);
        desk.setDepth(80.0);
        
        // Create a drawer unit
        DrawerUnit drawerUnit = new DrawerUnit();
        drawerUnit.setName("Mobile Drawer Unit");
        drawerUnit.setCategory("Drawer Units");
        drawerUnit.setDateAdded(LocalDateTime.now().minusDays(10));
        drawerUnit.setMaterialCondition("New");
        drawerUnit.setColor("Black");
        drawerUnit.setNotes("Includes 3 drawers for storage");
        drawerUnit.setWidth(60.0);
        drawerUnit.setHeight(75.0);
        drawerUnit.setDepth(45.0);
        drawerUnit.setHasWheels(true);

        // Create a window
        Window window = new Window();
        window.setName("Double Glazed Window");
        window.setCategory("Windows");
        window.setDateAdded(LocalDateTime.now().minusDays(15));
        window.setMaterialCondition("Reusable");
        window.setColor("White");
        window.setNotes("Complete with frame and hardware");
        window.setWidth(120.0);
        window.setHeight(150.0);
        window.setOpeningType(Window.OpeningType.SIDE_HUNG);
        window.setHingeSide(Window.HingeSide.RIGHT);
        window.setUValue(1.2);
        
        // Create a door
        Door door = new Door();
        door.setName("Wooden Interior Door");
        door.setCategory("Doors");
        door.setDateAdded(LocalDateTime.now().minusDays(20));
        door.setMaterialCondition("Damaged");
        door.setColor("Brown");
        door.setNotes("Has a broken handle that needs replacement");
        door.setWidth(90.0);
        door.setHeight(210.0);
        door.setSwingDirection(Door.SwingDirection.RIGHT);
        door.setUValue(2.0);
        
        // Create office cabinet
        OfficeCabinet cabinet = new OfficeCabinet();
        cabinet.setName("File Storage Cabinet");
        cabinet.setCategory("Cabinets");
        cabinet.setDateAdded(LocalDateTime.now().minusDays(3));
        cabinet.setMaterialCondition("Reusable");
        cabinet.setColor("Gray");
        cabinet.setNotes("Lockable with 2 keys included");
        cabinet.setWidth(80.0);
        cabinet.setHeight(180.0);
        cabinet.setDepth(45.0);
        cabinet.setOpeningType(OfficeCabinet.OpeningType.DOORS);
        
        // Save all materials first to get IDs
        List<MaterialRecord> savedMaterials = materialRepository.saveAll(Arrays.asList(desk, drawerUnit, window, door, cabinet));
        
        // Create placeholder pictures for the materials
        // (in a real app, you'd load actual images, but for testing we'll create dummy data)
        createDummyPicture(desk, "desk.jpg", materialPictureRepository);
        createDummyPicture(drawerUnit, "drawer_unit.jpg", materialPictureRepository);
        createDummyPicture(window, "window.jpg", materialPictureRepository);
        createDummyPicture(door, "door.jpg", materialPictureRepository);
        createDummyPicture(cabinet, "cabinet.jpg", materialPictureRepository);
        
        logger.info("Created sample materials with pictures");
        
        return savedMaterials;
    }
    
    private void createAuditTrail(AuditTrailRepository auditTrailRepository, 
                                 List<MaterialRecord> materials,
                                 List<User> users) {
        // Check if audit trail entries already exist
        if (auditTrailRepository.count() > 0) {
            logger.info("Audit trail entries already exist, skipping creation");
            return;
        }
        
        User admin = users.stream()
                .filter(u -> u.getEmail().equals("admin@example.com"))
                .findFirst()
                .orElse(users.get(0));
        
        User regularUser = users.stream()
                .filter(u -> u.getEmail().equals("user@example.com"))
                .findFirst()
                .orElse(users.get(0));
        
        LocalDateTime now = LocalDateTime.now();
        
        // Create some audit trail entries
        for (MaterialRecord material : materials) {
            // Creation entry (admin)
            AuditTrail creationEntry = new AuditTrail();
            creationEntry.setMaterial(material);
            creationEntry.setAction(AuditTrail.ActionType.CREATED);
            creationEntry.setDetails("Material was added to the system");
            creationEntry.setTimestamp(material.getDateAdded());
            creationEntry.setUserId(admin.getId());
            creationEntry.setUserName(admin.getName());
            auditTrailRepository.save(creationEntry);
            
            // Update entry (regular user)
            AuditTrail viewEntry = new AuditTrail();
            viewEntry.setMaterial(material);
            viewEntry.setAction(AuditTrail.ActionType.UPDATED);
            viewEntry.setDetails("Material details were updated");
            viewEntry.setTimestamp(now.minusDays(2));
            viewEntry.setUserId(regularUser.getId());
            viewEntry.setUserName(regularUser.getName());
            auditTrailRepository.save(viewEntry);
            
            // Update entry (only for some materials)
            if (material.getId() % 2 == 0) {
                AuditTrail updateEntry = new AuditTrail();
                updateEntry.setMaterial(material);
                updateEntry.setAction(AuditTrail.ActionType.UPDATED);
                updateEntry.setDetails("Changed condition from \"Damaged\" to \"Repairable\"");
                updateEntry.setTimestamp(now.minusDays(1));
                updateEntry.setUserId(admin.getId());
                updateEntry.setUserName(admin.getName());
                auditTrailRepository.save(updateEntry);
            }
        }
        
        logger.info("Created audit trail entries for materials");
    }
    
    private void createDummyPicture(MaterialRecord material, String fileName, 
                                   MaterialPictureRepository materialPictureRepository) {
        MaterialPicture picture = new MaterialPicture();
        picture.setMaterial(material);
        picture.setUploadDate(LocalDateTime.now());
        picture.setIsPrimary(true);
        picture.setFileName(fileName);
        picture.setContentType("image/jpeg");
        
        // Create dummy picture data (1x1 pixel JPEG)
        // In a real application, you'd load real images from resources
        byte[] dummyImageData = {
            (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0x00, 0x10, 0x4A, 0x46, 
            0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
            (byte) 0xFF, (byte) 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 
            0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D,
            0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12, 0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 
            0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20, 0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C,
            0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 
            0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32
        };
        
        picture.setPictureData(dummyImageData);
        picture.setFileSize((long) dummyImageData.length);
        picture.setDescription("Sample image for " + material.getName());
        
        materialPictureRepository.save(picture);
    }
} 