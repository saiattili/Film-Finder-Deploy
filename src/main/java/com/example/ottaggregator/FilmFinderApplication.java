package com.example.ottaggregator;

import com.example.ottaggregator.entity.Profile;
import com.example.ottaggregator.entity.User;
import com.example.ottaggregator.repository.ProfileRepository;
import com.example.ottaggregator.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class FilmFinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(FilmFinderApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedData(
			UserRepository userRepository,
			ProfileRepository profileRepository,
			PasswordEncoder passwordEncoder) {
		return args -> {
			String adminEmail = "admin@filmfinder.com";
			if (!userRepository.existsByEmail(adminEmail)) {
				User admin = User.builder()
						.name("System Admin")
						.email(adminEmail)
						.passwordHash(passwordEncoder.encode("adminpassword"))
						.role("ROLE_ADMIN")
						.build();
				User savedAdmin = userRepository.save(admin);

				Profile profile = Profile.builder()
						.user(savedAdmin)
						.bio("System Administration profile for monitoring platform usage.")
						.location("Global Control Room")
						.preferredLanguage("English")
						.avatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=admin")
						.build();
				profileRepository.save(profile);
				
				System.out.println(">>> SEEDED ADMIN USER: " + adminEmail + " / adminpassword <<<");
			}
		};
	}
}
