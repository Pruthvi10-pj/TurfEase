package example.turf.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"contact_api","turf_api"})
@EnableJpaRepositories(basePackages = {"contact_api","turf_api"})
@EntityScan(basePackages = {"contact_api","turf_api"})
public class TurfBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(TurfBookingApplication.class, args);
	}
}
